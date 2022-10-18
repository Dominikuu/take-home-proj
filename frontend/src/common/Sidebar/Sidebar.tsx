import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {set as setProp, cloneDeep} from 'lodash';
import {useNavigate,  useSearchParams} from 'react-router-dom';
import {statisticPosts} from 'api/post';
import EventBus from 'eventing-bus';
import {BlockEventType} from 'common/shared.definition';
import {Role} from 'App';
import './Sidebar.scss';

const CATEGORIES = [
  {label: 'Unitik News', value: null, default: true},
  {label: 'Products', value: 'product'},
  {label: 'Stories', value: 'story'},
  {label: 'Ideas', value: 'idea'},
  {label: 'Training', value: 'training'},
  {label: 'Blogs', value: 'blog'}
];
const TAGS = [
  {label: 'All tags', value: null, default: true},
  {label: 'PTP', value: 'ptp'},
  {label: 'PTMP', value: 'ptmp'},
  {label: 'Wi-fi', value: 'wifi'},
  {label: 'Antenna', value: 'antenna'},
  {label: 'Software', value: 'software'}
];

const DISPLAY: {label: string, value: null| boolean}[] = [
  {label: 'All', value: null},
  {label: 'Hidden', value: true},
  {label: 'Showed', value: false}
]

interface Statistic {
  category: {[key: string]: number};
  tag: {[key: string]: number};
  hidden: {[key: string]: number};
}

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<{[group: string]: Set<string|boolean>}>({category: new Set<string>(), tags: new Set<string>(), hidden: new Set<boolean>()});
  const [statistic, setStatistic] = useState<Statistic>({category: {}, tag: {}, hidden: {}});
  const authState = useSelector((state: {auth: any}) => state.auth);
  const history = useNavigate();
  const directToPostList = (selection: {[group: string]: Set<string>}, value: string| boolean | null) => {
    const queries: string[] = []
    for (const [group, items] of Object.entries(selection)){
      if ((items as Set<string>).size > 0) {
        const query_str = group + '=' + Array.from(items).join(encodeURIComponent(','))
        queries.push(query_str)
      }
    }
    const url = `/posts` + (value !== null ? `?${queries.join('&')}` : '');
    EventBus.publish(BlockEventType.ChangeFilter, selection);
    history(url);
  };
  const onFilterChipClicked = (field: string, opt: string| boolean | null, isSingleSelected?: boolean) =>{
    const origin_selected = cloneDeep(selected)
    if (origin_selected[field].has(opt)){
      origin_selected[field].delete(opt)
    } else {
      if (isSingleSelected) {
        origin_selected[field] = new Set<string | boolean>()
      }
      origin_selected[field].add(opt)
    }

    setSelected(origin_selected)
    directToPostList(origin_selected, opt)
  }
  const getStatistic = async () => {
    const {data: responseBody} = await statisticPosts();
    if (!responseBody) {
      return;
    }
    const _statistic = cloneDeep(statistic);
    for (const [field, items] of Object.entries(responseBody)) {
      for (const [group, count] of Object.entries(items as {})) {
        setProp(_statistic, `${field}.${group}`, count);
      }
    }
    setStatistic(_statistic);
  };
  useEffect(()=>{
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')
    const hidden = searchParams.get('hidden')
    const newSelected = {category: new Set<string>(), tags: new Set<string>(), hidden: new Set<boolean>()}
    if (category) {
      newSelected.category.add(category)
    }
    if (tags) {
      newSelected.tags = new Set(tags.split(','))
    }
    if (hidden) {
      const isHidden = hidden === 'true'? true: false;
      newSelected.hidden.add(isHidden)
    }
    setSelected(newSelected)
    
  }, [searchParams])
  useEffect(() => {
    (async () => {
      await getStatistic();
    })();
  }, []);
  return (
    <div className="Sidebar">
      <div className="sticky-container">
        <div className="group">
          <div className="header">
            <div className="group-title">
              Category
            </div>
          </div>
          <ul className="categories">
            {CATEGORIES.map(({label, value}, key) => {
              return (
                <li className={value && selected.category.has(value)?'selected': ''} key={key} onClick={() => onFilterChipClicked('category', value, true)}>
                  <div>{label}</div>
                  <div>{statistic.category[value || 'all'] || 0}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="group">
          <div className="header">
            <div className="group-title">
              Tags
            </div>

          </div>
          <ul className="tags">
            {TAGS.map(({label, value}, key) => {
              return (
                <li className={value && selected.tags.has(value)? 'selected': ''} key={key} onClick={() => onFilterChipClicked('tags', value)}>
                  <div>{label}</div>
                  <div>{statistic.tag[value || 'all'] || 0}</div>
                </li>
              );
            })}
          </ul>
        </div>
        {
          (authState.user && authState.user.role === Role.Admin)? <div className="group">
          <div className="header">
            <div className="group-title">
              Display
            </div>
          </div>
          <ul className="display">
            {DISPLAY.map(({label, value}, key) => {
              return (
                <li className={value !== null && selected.hidden.has(value)? 'selected': ''} key={key} onClick={() => onFilterChipClicked('hidden', value !== null? value: null, true)}>
                  <div>{label}</div>
                  <div>{statistic.hidden[ (value !== null && value.toString()) || 'all'] || 0}</div>
                </li>
              );
            })}
          </ul>
          </div>: null
        }
      </div>
    </div>
  );
};

export default Sidebar;
