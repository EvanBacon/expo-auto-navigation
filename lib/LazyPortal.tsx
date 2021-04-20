import * as React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import { useForceUpdate } from './useHelp'

export type PromiseCallback<T> = {
  readonly resolve: (result: T) => void
  readonly reject: (error: Error) => void
}

export type LazySource =
  | {
    readonly uri: string
  }
  | string

export type LazyOptions = {
  readonly dangerouslySetInnerJSX: boolean
}

export type LazyProps = {
  readonly source: LazySource
  readonly renderLoading?: () => JSX.Element
  readonly renderError?: (props: { readonly error: Error }) => JSX.Element
  readonly dangerouslySetInnerJSX?: boolean
  readonly onError?: (error: Error) => void
  readonly shouldOpenLazy?: (
    source: LazySource,
    options: LazyOptions
  ) => Promise<React.Component>
}

export function LazyPortal({
  source,
  renderLoading = () => <React.Fragment />,
  renderError = () => <React.Fragment />,
  dangerouslySetInnerJSX = false,
  onError = console.error,
  shouldOpenLazy,
  ...extras
}: LazyProps): JSX.Element {
  const { forceUpdate } = useForceUpdate()
  const [Component, setComponent] = React.useState<React.Component | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  React.useEffect(() => {
    ; (async () => {
      try {
        if (typeof shouldOpenLazy === 'function') {
          const Component = await shouldOpenLazy(source, {
            dangerouslySetInnerJSX,
          })
          return setComponent(() => Component)
        }
        throw new Error(
          `Expected function shouldOpenLazy, encountered ${typeof shouldOpenLazy}.`
        )
      } catch (e) {
        setComponent(() => null)
        setError(e)
        onError(e)
        return forceUpdate()
      }
    })()
  }, [
    shouldOpenLazy,
    source,
    setComponent,
    forceUpdate,
    setError,
    dangerouslySetInnerJSX,
    onError,
  ])

  if (typeof Component === 'function') {
    return React.createElement(Component, extras);
  } else if (error) {
    return <ErrorView error={error} />
  }
  return <Loading />
}

function ErrorView({ error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{error.message}</Text>
      <Text>{error.stack}</Text>
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
