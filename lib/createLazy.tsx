// Based on wormhole https://github.com/cawfree/react-native-wormhole

import * as React from 'react'

import {
  LazyOptions,
  LazyPortal as BaseLazyPortal,
  LazyProps,
  LazySource,
  PromiseCallback,
} from './LazyPortal'
import { loadRemoteComponentAsync } from './loadRemoteComponentAsync'

type LazyTasks = {
  readonly [uri: string]: PromiseCallback<React.Component>[]
}
type LazyComponentCache = {
  readonly [uri: string]: React.Component | null
}

const buildCompletionHandler = (
  cache: LazyComponentCache,
  tasks: LazyTasks
) => (uri: string, error?: Error): void => {
  const { [uri]: maybeComponent } = cache
  const { [uri]: callbacks } = tasks
  Object.assign(tasks, { [uri]: null })
  callbacks.forEach(({ resolve, reject }) => {
    if (!!maybeComponent) {
      return resolve(maybeComponent)
    }
    return reject(
      error || new Error(`[Lazy]: Failed to allocate for uri "${uri}".`)
    )
  })
}

// TODO:
// 1. Match all imports
// 2. Request the dev server send the import location using resolve-from. i.e. react-native -> node_modules/react-native/index.js
// 3. Fetch the bundle for each module and provide it to the global require before loading a page. i.e. node_modules/react-native/index.js -> http://127.0.0.1:19000/node_modules/react-native/index.bundle?platform=ios&dev=true&hot=false&minify=false&modulesOnly=true&shallow=false&runModule=true
// 4. Also use a module cache I guess...
function collectImports(src: string): string[] {
  // const matches = src.matchAll(/\$\$_REQUIRE\(.*,\s?"(.*)"\)/);
  return []
}

const buildRequestOpenUri = ({
  cache,
  shouldComplete,
}: {
  readonly cache: LazyComponentCache
  readonly shouldComplete: (uri: string, error?: Error) => void
}) => async (uri: string) => {
  try {
    const result = await fetch(uri, {
      method: 'get',
    }).then((res) => res.text())
    const Component = await loadRemoteComponentAsync(result)
    Object.assign(cache, { [uri]: Component })
    return shouldComplete(uri)
  } catch (e) {
    Object.assign(cache, { [uri]: null })
    if (typeof e === 'string') {
      return shouldComplete(uri, new Error(e))
    } else if (typeof e.message === 'string') {
      return shouldComplete(uri, new Error(`${e.message}`))
    }
    return shouldComplete(uri, e)
  }
}

const buildOpenUri = ({
  cache,
  tasks,
  shouldRequestOpenUri,
}: {
  readonly cache: LazyComponentCache
  readonly tasks: LazyTasks
  readonly shouldRequestOpenUri: (uri: string) => void
}) => (uri: string, callback: PromiseCallback<React.Component>): void => {
  const { [uri]: Component } = cache
  const { resolve, reject } = callback
  if (Component === null) {
    return reject(
      new Error(`Component at uri "${uri}" could not be instantiated.`)
    )
  } else if (typeof Component === 'function') {
    return resolve(Component)
  }

  const { [uri]: queue } = tasks
  if (Array.isArray(queue)) {
    queue.push(callback)
    return
  }

  Object.assign(tasks, { [uri]: [callback] })

  return shouldRequestOpenUri(uri)
}

const buildOpenLazy = ({
  shouldOpenUri,
}: {
  readonly shouldOpenUri: (
    uri: string,
    callback: PromiseCallback<React.Component>
  ) => void
}) => async (
  source: LazySource,
  options: LazyOptions
): Promise<React.Component> => {
    const { dangerouslySetInnerJSX } = options
    if (typeof source === 'string') {
      if (dangerouslySetInnerJSX === true) {
        return loadRemoteComponentAsync(source)
      }
      throw new Error(
        `[Lazy]: Attempted to instantiate a Lazy using a string, but dangerouslySetInnerJSX was not true.`
      )
    } else if (source && typeof source === 'object') {
      const { uri } = source
      if (typeof uri === 'string') {
        return new Promise<React.Component>((resolve, reject) =>
          shouldOpenUri(uri, { resolve, reject })
        )
      }
    }
    throw new Error(
      `[Lazy]: Expected valid source, encountered ${typeof source}.`
    )
  }

export default function createLazy() {
  const cache: LazyComponentCache = {}
  const tasks: LazyTasks = {}

  const shouldComplete = buildCompletionHandler(cache, tasks)
  const shouldRequestOpenUri = buildRequestOpenUri({
    cache,
    shouldComplete,
  })
  const shouldOpenUri = buildOpenUri({
    cache,
    tasks,
    shouldRequestOpenUri,
  })

  const shouldOpenLazy = buildOpenLazy({
    shouldOpenUri,
  })

  const LazyPortal = (props: LazyProps) => (
    <BaseLazyPortal {...props} shouldOpenLazy={shouldOpenLazy} />
  )

  const preload = async (uri: string): Promise<void> => {
    await shouldOpenLazy({ uri }, { dangerouslySetInnerJSX: false })
  }

  return Object.freeze({
    LazyPortal,
    preload,
  })
}
