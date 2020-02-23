import React, { FC } from 'react'
import { Pie } from 'react-chartjs-2'
import ErrorBoundary from '../../../ErrorBoundary'
import { ChartData } from '../../../services/models/general'

interface SkillGraphProps {
  data?: ChartData
}

const SkillGraph: FC<SkillGraphProps> = ({ data = null }) => (
  <div className="ui container">
    <div className="content" style={{ marginTop: '15px' }}>
      <h3 className="ui header">Skill Graph</h3>
    </div>
    <hr />
    <ErrorBoundary>
      <Pie data={data} width={80} />
    </ErrorBoundary>
  </div>
)

export default SkillGraph
