import * as execa from 'execa'
import * as path from 'path'

const oldCwd = process.cwd

describe('Check file generation', () => {
  beforeEach(async () => {
    await execa('mkdir', ['test'])
    process.cwd = () => path.join(oldCwd(), 'test')
  })

  afterAll(async () => {
    await execa('rm', ['-rf', 'test'])
    process.cwd = () => oldCwd()
  })

  it('should has all files', async () => {
    const { code } = await execa('wizard')
    expect(code).toBe(0)
  })
})
