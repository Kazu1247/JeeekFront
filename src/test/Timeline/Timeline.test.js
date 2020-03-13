import { ReactSelector, waitForReact } from 'testcafe-react-selectors'

const signIn = ReactSelector('button').withText('signIn')
const timeline = ReactSelector('Navbar div Link h3').withText('Timeline')

fixture `ログインから投稿内容の入力まで`
    .page `http://jeeek-dev.web.app/`

test('ログインから投稿内容の入力まで', async t => {
  await t
    .click(signIn)
    .click(timeline)
})
