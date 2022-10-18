export enum Category{
    Product = 'PRODUCT',
    Idea = 'IDEA',
    Training = 'TRAINING',
    Blog = 'BLOG',
    Announcement = 'ANNOUNCEMENT',
    Story = 'STORY'
}

export enum Tag {
    Ptp = 'PTP',
    Ptmp = 'PTMP',
    Wifi = 'WIFI',
    Antenna = 'ANTENNA',
    Accessories = 'ACCESSORIES',
    Software = 'SOFTWARE',
}

export const CATEGORY_OPTIONS = [
    {
        label: 'Product', value: Category.Product
    }, {
        label: 'Idea', value: Category.Idea
    },{
        label: 'Training', value: Category.Training
    },{
        label: 'Blog', value: Category.Blog
    },{
        label: 'Announcement', value: Category.Announcement
    },{
        label: 'Story', value: Category.Story
    }

]

export const TAG_OPTIONS = [
    {
        label: 'Ptp', value: Tag.Ptp
    }, {
        label: 'Ptmp', value: Tag.Ptmp
    }, {
        label: 'Wifi', value: Tag.Wifi
    }, {
        label: 'Antenna', value: Tag.Antenna
    }, {
        label: 'Accessories', value: Tag.Accessories
    }, {
        label: 'Software', value: Tag.Software
    },

]