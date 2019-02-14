import React, { PureComponent } from 'react'
import {Link} from 'react-router'

import ModelStatus from 'src/loudml/components/ModelStatus'
import ModelActions from 'src/loudml/components/ModelActions'
import DashboardDropdown from 'src/loudml/components/DashboardDropdown'

import {TimeRange} from 'src/types'
import {Model, Job} from 'src/loudml/types/model'

import 'src/loudml/styles/loudml.scss'
import { Dashboard } from 'src/types';

interface Props {    
    source: {id: string}
    model: Model
    jobs: Job[]
    onStart: (name: string) => void
    onStop: (name: string) => void
    onTrain: (name: string, timeRange: TimeRange) => void
    onStopTrain: (name: string) => void
    onDelete: (name: string) => void
    onForecast: (name: string, timeRange: TimeRange) => void
    onStopForecast: (name: string) => void
    onClone: (name: string) => void
    onViewDashboard: (dashboard: Dashboard) => void
    onNewDashboard: (model: Model) => void
    onAddToDashboard: (model: Model, dashboard: Dashboard) => void
    dashboards: Dashboard[]
}

class ModelsRow extends PureComponent<Props, {}> {
    constructor(props) {
        super(props)

        this.onClone = this.onClone.bind(this)
    }

    public render() {
        const {
            source: {id},
            model,
            model: {
                settings: {name},
            },
            jobs,
            onDelete,
            onStart,
            onStop,
            onTrain,
            onStopTrain,
            onForecast,
            onStopForecast,
            onViewDashboard,
            onNewDashboard,
            onAddToDashboard,
            dashboards,
        } = this.props

        return (
            <tr>
                <td>
                    <Link to={`/sources/${id}/loudml/models/${name}/edit`}>
                        {name}
                    </Link>
                </td>
                <td>
                    <ModelStatus
                        model={model}
                        jobs={jobs}
                    />
                </td>
                <td>
                    <div className="actions-container">
                        <button 
                            className="btn btn-xs btn-default table--show-on-row-hover"
                            onClick={this.onClone}>
                            <span className="icon duplicate" />
                            Clone
                        </button>
                        <DashboardDropdown
                            model={model}
                            dashboards={dashboards}
                            onView={onViewDashboard}
                            onNew={onNewDashboard}
                            onAddTo={onAddToDashboard}
                            />
                    </div>
                </td>
                <td className="text-right">
                    <ModelActions
                        model={model}
                        jobs={jobs}
                        onStart={onStart}
                        onStop={onStop}
                        onTrain={onTrain}
                        onStopTrain={onStopTrain}
                        onForecast={onForecast}
                        onStopForecast={onStopForecast}
                        onDelete={onDelete}
                    />
                </td>
            </tr>
        )
    }

    public onClone() {
        const {
            model: {settings: {name}},
            onClone,
        } = this.props

        onClone(name)
    }

}

export default ModelsRow
