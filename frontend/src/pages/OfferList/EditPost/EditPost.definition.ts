import {Category, Tag} from 'common/shared.definition'

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

export const INIT_STATE = {
    fields: {
      title: '1235555',
      category: Category.Product,
      tags: [Tag.Wifi, Tag.Ptmp],
      content: '',
      author: 'asd111112312',
      is_pinned: false,
    //   ==================
        jobTitle: 'we',
        salary: 121312,
        bonus: 100000,
        culture: 'we',
        learning: 'we'
    },
    fieldErrors: {}
};