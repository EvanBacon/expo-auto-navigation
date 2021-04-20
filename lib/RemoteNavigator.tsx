import * as React from 'react'
import createLazy from './createLazy'
import { useJSONRequest } from './useHelp'
import { getDevServerUrl, getDevServerUrlForFilePath } from './getDevServer'
import { useNavigator } from './getNavigator'

const { Loadable } = createLazy()

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
}: {
  info: DirectoryInfo
}) {
  const { navigator: type, ...innerProps } = info.config
  const pages = info.pages
  const Nav = useNavigator(type);
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
        // Remove the last extension component
        // TODO: do this in the middleware so extension resolution can be accounted for.
        let fileName = route.name.includes('.')
          ? route.name.split('.').slice(0, -1).join('.')
          : route.name;

        let component: (props: any) => JSX.Element;
        if (route.directoryInfo) {
          // Is directory
          component = function () {
            return (
              <RemoteNavigator info={route.directoryInfo} />
            )
          }
        } else {
          // TODO: Maybe move this into the middleware.
          const filePathWithoutExtension = `pages/${root}${fileName}`
          const uri = getDevServerUrlForFilePath(
            filePathWithoutExtension
          )
          component = function (props) {
            return <Loadable _lazy_source={{ uri }} {...props} />
          }
        }
        return React.createElement(Nav.Screen, { name: fileName, key: fileName }, component)
      }),
    [type]
  )

  return React.createElement(Nav.Navigator, innerProps, screens);
}


export default function AutoNavigator() {
  // Request the routes from expo/metro-config `/routes` for path `/`
  const { value, error } = useJSONRequest<DirectoryInfo>(getDevServerUrl() + 'routes', {
    headers: { dir: '/' },
  })

  if (error) {
    throw error
  }

  if (!value) {
    return null
  }

  return <RemoteNavigator info={value} />
}
