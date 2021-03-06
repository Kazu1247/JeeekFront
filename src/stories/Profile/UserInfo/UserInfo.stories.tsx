import React from 'react'
import { storiesOf } from '@storybook/react'
import UserInfo from '../../../components/Profile/UserInfo'
import { AuthUserState } from '../../../reducers/auth'
import { FollowState } from '../../../reducers/follows'

export default {
  title: 'Profile/UserInfo',
  component: UserInfo,
  excludeStories: /.*Data$/,
}

export const userData: AuthUserState = {
  uid: '4sra3r4zibfrzp4i',
  name: 'かず',
  email: 'kazuhiro.1247@gmail.com',
  photoUrl: 'http://ドラマシリコンバレー.com/content/images/siliconvalley/richard.jpg',
  phoneNumber: '09091879023',
  emailVerified: true,
  startedAt: '2019/12/1',
  selfIntroduction: '俺が世界を救う',
}

export const followsData: FollowState = {
  followings: [
    {
      uid: 'akkynv4v3v8d5evx',
      name: 'ビルゲイツ',
      photoUrl: 'bill.png',
    },
  ],
  followers: [
    {
      uid: 'i4ac4evjvhc7cv5x',
      name: 'tono',
      photoUrl: 'tono.png',
    },
  ],
}

const descriptionData = 'フロントエンドエンジニアです。'

storiesOf('Profile/UserInfo', module).add('UserInfo', () => (
  <UserInfo user={userData} follows={followsData} description={descriptionData} />
))
