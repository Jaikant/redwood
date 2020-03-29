import path from 'path'

import {
  getConfig,
  getConfigPath,
  getConfigSides,
  getSideConfig,
} from './config'
import { TargetEnum } from './config'

export interface NodeTargetPaths {
  db: string
  dbSchema: string
  src: string
  functions: string
  graphql: string
  lib: string
  services: string
}

export interface BrowserTargetPaths {
  src: string
  routes: string
  pages: string
  components: string
  layouts: string
  config: string
}

export interface Paths {
  base: string
  sides: {
    [side: string]: NodeTargetPaths | BrowserTargetPaths
  }
}

const mapNodePaths = (wsPath: string): NodeTargetPaths => {
  return {
    src: path.join(wsPath, 'src'),
    functions: path.join(wsPath, 'src/functions'),
    graphql: path.join(wsPath, 'src/graphql'),
    lib: path.join(wsPath, 'src/lib'),
    services: path.join(wsPath, 'src/services'),
    db: path.join(wsPath, 'prisma'),
    dbSchema: path.join(wsPath, 'prisma/schema.prisma'),
  }
}

const mapBrowserPaths = (wsPath: string): BrowserTargetPaths => {
  return {
    src: path.join(wsPath, 'src'),
    routes: path.join(wsPath, 'src/Routes.js'),
    pages: path.join(wsPath, 'src/pages'),
    components: path.join(wsPath, 'src/components'),
    layouts: path.join(wsPath, 'src/layouts'),
    config: path.join(wsPath, 'src/config'),
  }
}

/**
 * Absolute paths for the directory structure of a Redwood project based
 * on the `redwood.toml` file.
 */
export const getPaths = (): Paths => {
  // The Redwood config file denotes the base directory of a Redwood project.
  const base = path.dirname(getConfigPath())

  const configSides = getConfigSides()
  // Redwood supports different targets for sides. They have different directory
  // structures, so we map the side based on the "target" parameter.
  const sides = Object.keys(configSides).reduce((acc, key) => {
    const side = configSides[key]
    let paths
    switch (side.target) {
      case TargetEnum.NODE:
        paths = mapNodePaths(path.join(base, side.path))
        break
      case TargetEnum.BROWSER:
        paths = mapBrowserPaths(path.join(base, side.path))
        break
      default:
        throw new Error(
          `Woah there! "${key}" has a target that is is not currently supported:\n${JSON.stringify(
            side,
            undefined,
            2
          )}`
        )
    }
    return {
      [key]: paths,
      ...acc,
    }
  }, {})

  return {
    base,
    sides,
  }
}

export const getSidePaths = (
  name: string
): NodeTargetPaths | BrowserTargetPaths => {
  const paths = getPaths()
  if (!paths.sides[name]) {
    throw new Error(
      `A side named "${name}" does not exist? Is it in your redwood.toml configuration?`
    )
  }
  return paths.sides[name]
}
