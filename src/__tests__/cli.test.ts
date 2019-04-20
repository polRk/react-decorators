import * as execa from 'execa'
import * as path from 'path'

const oldCwd = process.cwd

describe('Check file generation', () => {
  beforeEach(async () => {
    await execa('mkdir', ['test'])
    await execa('npm', ['link'])
    process.cwd = () => path.join(oldCwd(), 'test')
  })

  afterAll(async () => {
    await execa('rm', ['-rf', 'test'])
    await execa('npm', ['unlink'])
    process.cwd = () => oldCwd()
  })

  it('should has all files', async () => {
    const { code } = await execa('wizard')
    expect(code).toBe(0)
  })
})
