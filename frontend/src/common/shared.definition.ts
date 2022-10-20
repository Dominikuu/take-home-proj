export enum BlockEventType {
    /**
     * Display Topic title on Nav after scrolling
     */
    UploadCompensationCsv = 'UploadCompensationCsv',
    CreateNewComment = 'CreateNewComment',
    DeleteComment = 'DeleteComment',
    ChangeFilter = 'ChangeFilter',
    ShowSnackbarMessage = 'ShowSnackbarMessage',
    ToggleDrawer = 'ToggleDrawer',
    ShowTitleOnNav = 'ShowTitleOnNav',
}
export interface Error {
    [errKey: string]: string;
}
export type FormCtrlProps<T> = {
    value: T;
    name: string;
    formControlName: string;
    disabled?: boolean;
    placeholder?: string;
    required?: boolean;
    type?: string;
    validate?: (val: T) => boolean;
    onChange?: (event: {formControlName: string; value: T; error: boolean | Error}) => any;
    // options?: {label: string; value: any; }[];
    // exclusive?: boolean;
};

export enum Category {
    Product = 'PRODUCT',
    Idea = 'IDEA',
    Training = 'TRAINING',
    Blog = 'BLOG',
    Announcement = 'ANNOUNCEMENT',
    Story = 'STORY',
}

export enum Tag {
    Ptp = 'PTP',
    Ptmp = 'PTMP',
    Wifi = 'WIFI',
    Antenna = 'ANTENNA',
    Accessories = 'ACCESSORIES',
    Software = 'SOFTWARE',
}

export const CategroryColor: {
    [key: string]: 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
} = {
    [Category.Product]: 'primary',
    [Category.Idea]: 'default',
    [Category.Training]: 'secondary',
    [Category.Blog]: 'error',
    [Category.Announcement]: 'info',
    [Category.Story]: 'success',
};
