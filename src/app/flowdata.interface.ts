import { ResponseData, TaskState } from 'ti-framework';

/**
 * every Task will implement this listener to receive and process Task updates
 */
export interface TaskProgressListener {
    /**
     * uniqueId for each listener
     */
    uniqueId: string

    /**
     * call this method to process data / next steps when task update is recieved from server
     * @param event 
     */
    taskUpdate(event: ResponseData)

    /**
     ** call this method to process data / next steps when task complete is recieved from server
     * @param event 
     */
    taskFinish(event: ResponseData)
    /**
     * customer uses this method to send flow completion ACK to server
     */
    flowFinish()
}

/**
 * Each Task MUST send updates in below format
 */
export interface TaskPayload {
    /**
     * updates like Task has started / completed / some data is being sent
     */
    status: TaskStatus,

    /**
     * payload to be sent with each Task Update
     */
    payload?: TaskOutput,

    /**
     * unique for each Task. Contains Refer to ti.TaskState
     */
    taskState?: TaskState
}

/**
 * Each Task MUST send updates with status: TaskStatus 
 */
export enum TaskStatus {
    /**
     * To be used when Task Starts
     */
    STARTED = "STARTED",

    /**
     * To be used when submitting any output from each Task. 
     * Usually needed when User Actions on UI needs to be sent to server
     */
    SUBMIT = "SUBMIT",

    /**
     * To be used when current Task is finished and app will navigate to next task
     */
    FINISHED = "FINISHED"
}

/**
 * payload to be sent with each Task Update
 */
export interface TaskOutput {
    data?: any,
    useraction?: UserProvidedAction
}


/**
 * Generic Alert used across the app. Refer to src/app/alert for more info
 */
export enum AlertType {
    SUCCESS = 'success',
    ERROR = 'danger',
    INFO = 'warning'
}

/**
 * Different Actions available on each Task UI. 
 * Eg: ACCEPT or DENY Terms & Conditions 
 */
export enum UserProvidedAction {
    ACCEPT = "ACCEPT",
    DENY = "DENY",
    OK = "OK",
    CANCEL = "CANCEL",
    SUBMIT = "SUBMIT",
    DISMISS = "DISMISS",
    AGREE = "AGREE"
}

/**
 * Different INput types possibly enbaled on eacj Task -UI.
 * Eg: Users input a name
 * Eg: Users input a signature/initial
 * Eg: there is nothing for users to input
 */
export enum UsersInputType {
    INPUT_SINGATURE = "INPUT_SINGATURE",
    INPUT_FORM = "INPUT_FORM",
    INPUT_MIXED = "INPUT_MIXED",
    NONE = "NONE"
}

