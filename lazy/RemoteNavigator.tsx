import * as React from 'react'
import createLazy from './createLazy'
import getDevServer from 'react-native/Libraries/Core/Devtools/getDevServer'
import { getRemoteFileURLForMetro, useJSONRequest } from './useHelp'

const { LazyPortal } = createLazy()

// 1. Create a component that can load a remote React component given a file path via `getRemoteFileURLForMetro`
// 2. Load a hosted JSON file from Metro dev server
// 3. Hot swap from remote URLs to embedded file paths
// 4. Support passing in modules so each bundle doesn't include all JS (not complete)

type NavigationConfig = {
  navigator: 'stack' | 'bottom-tabs' | 'drawer'
}

type DirectoryInfo = {
  config?: NavigationConfig
  pages: Page[]
  root: string
}

type Page = {
  name: string
  filePath: string
  directoryInfo?: DirectoryInfo
}

function RemoteNavigator({
  info,
  baseURL,
}: {
  info: DirectoryInfo
  baseURL: string
}) {
  const type = info.config.navigator
  const pages = info.pages
  const Nav = React.useMemo(() => getNavigator(type)(), [type])
  let root =
    info.root.length > 0
      ? info.root.endsWith('/')
        ? info.root
        : info.root + '/'
      : info.root
  if (root === '/') root = ''
  const screens = React.useMemo(
    () =>
      pages.map((route) => {
        let key = route.name.includes('.')
          ? route.name.split('.').slice(0, -1).join('.')
          : route.name
        let props: any = {}
        if (route.directoryInfo) {
          props.component = function () {
            return (
              <RemoteNavigator baseURL={baseURL} info={route.directoryInfo} />
            )
          }
        } else {
          const uri = getRemoteFileURLForMetro(
            baseURL,
            `pages/${root}${key + '.bundle'}`
          )
          props.component = function (props) {
            return <LazyPortal source={{ uri }} {...props} />
          }
        }
        return <Nav.Screen name={key} key={key} {...props} />
      }),
    [type]
  )

  return React.useMemo(() => <Nav.Navigator>{screens}</Nav.Navigator>, [])
}

function getNavigator(name) {
  if (name === 'bottom-tabs')
    return require('@react-navigation/bottom-tabs').createBottomTabNavigator
  if (name === 'drawer')
    return require('@react-navigation/drawer').createDrawerNavigator
  if (name === 'stack')
    return require('@react-navigation/stack').createStackNavigator
  throw new Error('unknown type: ' + name)
}

// Get the dev server URL
const baseURL = getDevServer().url

export default function AutoNavigator() {
  // Request the routes from expo/metro-config `/routes` for path `/`
  const { value, error } = useJSONRequest<DirectoryInfo>(baseURL + 'routes', {
    headers: { dir: '/' },
  })

  if (error) {
    throw error
  }

  if (!value) {
    return null
  }

  return <RemoteNavigator baseURL={baseURL} info={value} />
}
