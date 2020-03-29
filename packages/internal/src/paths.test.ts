import mockfs from 'mock-fs'

import * as config from './config'
import { getPaths } from './paths'

jest
  .spyOn(config, 'getConfigPath')
  .mockImplementation(() => '/path/to/project/redwood.toml')

describe('paths', () => {
  describe('getPaths', () => {
    mockfs({
      'redwood.toml': '',
    })

    it('provides defaults based off an empty configuration', () => {
      const paths = getPaths()
      expect(paths).toEqual({
        base: '/path/to/project',
        workspaces: {
          api: {
            db: '/path/to/project/api/prisma',
            dbSchema: '/path/to/project/api/prisma/schema.prisma',
            functions: '/path/to/project/api/src/functions',
            graphql: '/path/to/project/api/src/graphql',
            lib: '/path/to/project/api/src/lib',
            services: '/path/to/project/api/src/services',
            src: '/path/to/project/api/src',
          },
          web: {
            components: '/path/to/project/web/src/components',
            config: '/path/to/project/web/src/config',
            layouts: '/path/to/project/web/src/layouts',
            pages: '/path/to/project/web/src/pages',
            routes: '/path/to/project/web/src/Routes.js',
            src: '/path/to/project/web/src',
          },
        },
      })
    })
  })

  afterAll(() => {
    jest.clearAllMocks()
    mockfs.restore()
  })
})
