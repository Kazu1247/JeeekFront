/** @jsx jsx */
import React, { FC } from 'react'
import { css, jsx } from '@emotion/core'
import { Link } from 'react-router-dom'
import { Activity } from '../../../reducers/feed'

const categoryLabel = css`
  width: 5em;
  height: 3em;
`

const rankLabel = css`
  width: 3em;
  height: 3em;
`

const label = css`
  text-align: center;
  font-size: 15px;
`

const smallRightMargin = css`
  margin-right: 1em;
`

const smallTopMargin = css`
  margin-top: 1em;
`

const categoryMap = ['学習', '開発', '執筆', '賞等']
const rankMap = ['C', 'B', 'A', 'S']

export interface ActivityCardProps {
  activity: Activity
}

const ActivityCard: FC<ActivityCardProps> = ({ activity }) => (
  <div className="ui card" style={{ width: '98%' }}>
    <div className="content">
      <div className="right floated ui label" css={rankLabel}>
        <p css={label}>{rankMap[activity.rank]}</p>
      </div>
      <div className="right floated ui label" css={categoryLabel}>
        <p css={label}>{categoryMap[activity.category]}</p>
      </div>
      <img
        className="left floated ui image"
        src={activity.userTiny ? activity.userTiny.photoUrl : ''}
        style={{ width: '2.5em', height: '2.5em' }}
        alt=""
      />
      <Link className="header" to="/friends">
        {activity.userTiny ? activity.userTiny.name : ''}
      </Link>
      <div className="meta">{activity.updatedAt.toDate().toDateString()}</div>
      <div className="description">
        <div className="content">
          <div>
            <b>{activity.content.subject}</b>
          </div>
          <div>{activity.content.comment}</div>
          <div css={smallTopMargin}>
            {activity.tags.map((tag: string) => (
              <div key={tag.toString()} className="ui blue mini label">
                {tag.toString()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="extra content">
      <div className="left floated">
        <i className="reply icon" />
      </div>
      <div className="right floated like">
        <i className="thumbs up outline icon"> </i>20
      </div>
      <div className="right floated star" css={smallRightMargin}>
        <i className="yen sign icon"> </i>10
      </div>
    </div>
  </div>
)

export default ActivityCard
