import {AnyAction} from 'redux';
import {ActionType} from './offer.action';

const initialState: OfferState = {
    offer: [
        {
            jobTitle: 'Software Engineer2',
            salary: 1000000,
            bonus: 1000,
            culture: 'Open',
            learning: 'Weekly sharing conference, Tech conferene fee',
            content: '<h3><em>Welcome to XXX company</em></h3>\n',
            author: {},
            id: '60e734f6-8fd0-4181-9dea-81ef80f55857',
            comments: [
                {
                    access: 'PUBLIC',
                    content: '<h3>Could you give more detailed information</h3>\n',
                    id: '77863270-566a-47da-8f45-9a88493ac692',
                    author: {},
                    create_time: 1666292937484,
                },
                {
                    access: 'PUBLIC',
                    content: '<h3>Could you give more detailed information1</h3>\n',
                    id: 'fdf9c80c-2e71-4538-bc9e-59b21619bd0c',
                    author: {},
                    create_time: 1666292937484,
                },
            ],
            create_time: 1666292937484,
        },
        {
            jobTitle: 'Software Engineer1',
            salary: 1000000,
            bonus: 1000,
            culture: 'Open',
            learning: 'Weekly sharing conference, Tech conferene fee',
            content:
                '<h1>Benefit</h1>\n<ul>\n<li>11111111111111111111111</li>\n<li>22222222222222</li>\n<li>333333333333333</li>\n</ul>\n',
            author: {},
            id: 'd56805c3-55b2-4785-a275-e182fae04155',
            comments: [],
            create_time: 1666292884249,
        },
        {
            jobTitle: 'Software Engineer',
            salary: 1000000,
            bonus: 1000,
            culture: 'Open',
            learning: 'Weekly sharing conference, Tech conferene fee',
            content: '<p></p>\n',
            author: {},
            id: '90afc204-9b6d-445c-8515-707fb41b40e1',
            comments: [],
            create_time: 1666292785048,
        },
    ],
};

export default function offerReducer(state: OfferState = initialState, action: AnyAction): OfferState {
    const {type, ...payload} = action;
    switch (type) {
        case ActionType.CREATE:
            console.log(type);
            return {
                ...state,
                offer: payload.offer,
            };
        case ActionType.LIST:
            return {
                ...state,
                offer: [],
            };
        case ActionType.DELETE:
            return {
                ...state,
                offer: payload.offer,
            };
        case ActionType.LOAD:
            return {
                ...state,
                offer: payload.offer,
            };
        case ActionType.CREATE_COMMENT:
            return {
                ...state,
                offer: payload.offer,
            };
        default:
            return state;
    }
}
