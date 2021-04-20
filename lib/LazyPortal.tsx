import * as React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import { useForceUpdate, useMounted, useSafeState } from './useHelp'


export type LazySource =
  | {
    readonly uri: string
  }
  | string

export type LazyOptions = {
  readonly dangerouslySetInnerJSX: boolean
}

// Prefix props so it's harder to clash with a custom component's props...
export type LazyProps = {
  readonly _lazy_source: LazySource
  readonly _lazy_dangerouslySetInnerJSX?: boolean
  readonly _lazy_shouldOpenLazy?: (
    source: LazySource,
    options: LazyOptions
  ) => Promise<React.Component>
}

export function LazyPortal({
  _lazy_source,
  _lazy_dangerouslySetInnerJSX = false,
  _lazy_shouldOpenLazy,
  ...extras
}: LazyProps): JSX.Element {
  const forceUpdate = useForceUpdate()
  const [state, setState] = useSafeState<React.Component>();
  const isMounted = useMounted()
  React.useEffect(() => {
    _lazy_shouldOpenLazy(_lazy_source, {
      dangerouslySetInnerJSX: _lazy_dangerouslySetInnerJSX,
    }).then(value => {
      if (isMounted.current) setState({ value });
    }).catch(error => {
      if (isMounted.current) {
        console.error(error);
        setState({ error })
        forceUpdate()
      }
    })
  }, [
    _lazy_shouldOpenLazy,
    _lazy_source,
    setState,
    forceUpdate,
    _lazy_dangerouslySetInnerJSX,
  ])

  if (typeof state.value === 'function') {
    return React.createElement(state.value, extras);
  } else if (state.error) {
    return <ErrorView error={state.error} />
  }
  return <Loading />
}

function ErrorView({ error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{error.message}</Text>
      {/* the stack needs to be symbolicated before it can be useful */}
      {false && <Text>{error.stack}</Text>}
    </View>
  )
}

function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </View>
  )
}
