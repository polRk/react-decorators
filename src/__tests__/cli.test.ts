import * as execa from 'execa'

describe('Check file generation', () => {
  beforeEach(async () => {
    await execa('mkdir', ['test'])
  })

  afterAll(async () => {
    await execa('rm', ['-rf', 'test'])
  })

  it('should started', async () => {
    await execa('chmod', ['a+x', 'lib/cli.js'])
    const { code } = await execa('wizard')
    expect(code).toBe(0)
  })
})
