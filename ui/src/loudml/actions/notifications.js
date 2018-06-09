import {FIVE_SECONDS, TEN_SECONDS, INFINITE} from 'shared/constants/index'

const notifySuccess = message => ({
    type: 'success',
    icon: 'checkmark',
    duration: FIVE_SECONDS,
    message,
})

const notifyError = (duration, message) => ({
    type: 'error',
    icon: 'alert-triangle',
    duration,
    message,
})

export const notifyErrorGettingModel = message => notifyError(
    TEN_SECONDS,
    `cannot get model: ${message}`,
)

export const notifyErrorGettingModels = message => notifyError(
    TEN_SECONDS,
    `cannot get models: ${message}`,
)

export const notifyModelDeleted = () => notifySuccess("model deleted")

export const notifyModelDeleteFailed = (name, message) => notifyError(
    TEN_SECONDS,
    `cannot delete '${name}' model: ${message}`,
)

export const notifyModelCreated = () => notifySuccess("model created")

export const notifyModelCreationFailed = (name, message) => notifyError(
    INFINITE,
    `cannot create '${name}' model: ${message}`,
)

export const notifyModelUpdated = () => notifySuccess("model updated")

export const notifyModelUpdateFailed = (name, message) => notifyError(
    INFINITE,
    `cannot update '${name}' model: ${message}`,
)

export const notifyModelTraining = job => notifySuccess(`Training job ${job.name} queued`)

export const notifyModelTrainingFailed = (name, message) => notifyError(
    INFINITE,
    `Could not start '${name}' model training: ${message}`,
)

export const notifyModelStarting = name => notifySuccess(`Prediction for model ${name} started`)

export const notifyModelStartingFailed = (name, message) => notifyError(
    INFINITE,
    `Could not start prediction job for model '${name}': ${message}`,
)

export const notifyModelForecasting = job => notifySuccess(`Forecast job ${job.name} queued`)

export const notifyModelForecastingFailed = (name, message) => notifyError(
    INFINITE,
    `Could not start forecast job for model '${name}': ${message}`,
)

export const notifyModelStopped = name => notifySuccess(`Prediction on '${name}' stopped`)

export const notifyModelStoppedFailed = (name, message) => notifyError(
    INFINITE,
    `Could not stop prediction job for model '${name}': ${message}`,
)

export const notifyJobSuccess = job => notifySuccess(`Job ${job.name} ${job.state}`)

export const notifyJobFailed = job => notifyError(
    INFINITE,
    `Job ${job.type} failed for model '${job.name}': ${job.error}`,
)

export const notifyJobStopped = name => notifySuccess(`job on model '${name}' stopped`)

export const notifyJobStoppedFailed = (name, message) => notifyError(
    INFINITE,
    `Stopping job failed for model '${name}': ${message}`,
)
