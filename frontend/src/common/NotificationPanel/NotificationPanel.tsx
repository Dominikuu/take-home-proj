import React, {useEffect, useState, MouseEvent, useRef}from 'react';
import {cloneDeep, get} from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useNavigate} from 'react-router-dom';
import {
  Backdrop,
  Popper,
  Badge,
  Box,
  Fade,
  Typography,
  IconButton,
  Paper,
  Link,
  ListSubheader,
  NotificationsIcon,
  CircularProgress,
  List,
  ListItemButton ,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Brightness1RoundedIcon,
} from 'lib/mui-shared';
import {TimeFormatter} from 'lib/formatter/time';
import {LogLevel, listAllNotifications} from 'api/user/notifications'
import {updateAllRead} from 'api/user/notifications/mark-as-all-read'
import {updateOneRead} from 'api/user/notification/read'
import {NOTI_CONTEXT, SEARCH_DAY_BEFORE, NotiItem} from './NotificationPanel.definition'

const LIST_ITEM_HEIGHT = 72.5
const MIN_LIST_LENGTH = 5

const NotificationPanel = ({unread, onRefresh}: {unread: number; onRefresh:(refresh: boolean)=>void}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const [unreadCount, setUnreadCount] = useState<number>(unread)
  const [notiList, setNotiList] = useState<NotiItem[]>([])

  const history = useNavigate();
  const queryParams = useRef({skip: -1, limit: MIN_LIST_LENGTH});
  const onNotificationClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open)
  };

  const convertNotiDisapy = (notis)=>{
    const curlyBraceRxp = /{([^}]+)}/g
    const interpolateWording = (string, values) => string.replace(curlyBraceRxp, (match, offset) => get(values, offset));
    const displayList = notis.map((noti: NotiItem)=>{
      const template = get(NOTI_CONTEXT, `${noti.type}.${noti.action}`)
      return Object.assign(noti,{context: interpolateWording(template, noti)})
    })
    return displayList
  }

  const onMarkAllRead = () => {
    (async()=>{
      await updateAllRead({notification_ids: notiList.map(({notification_id}) => notification_id)}).then(()=>{
        const oldNotiList = cloneDeep(notiList).map((noti)=>{
          noti.is_read = true
          return noti
        })
        setNotiList(oldNotiList)
        onRefresh(true)
      })
    })()
  }

  const onNotiItemClick = (notificationId: string, isRead: boolean, linkParam: {post_id?: string; comment_id?: string})=>{
    if (!isRead) {
      (async()=>{
        await updateOneRead({notification_id: notificationId}).then(()=>{
          const oldNotiList = cloneDeep(notiList)
          const targetNoti = oldNotiList.find(({notification_id})=> notification_id === notificationId)
          targetNoti.is_read = true
          setNotiList(oldNotiList)
          onRefresh(true)
        })
      })()
    }
    setOpen(false)
    if(linkParam && linkParam.post_id){
      history(`/post/${linkParam.post_id}`);
    }
  }

  const fetchNotifications = async (isReset?:boolean)=>{
    if(!open) {
      return
    }
    setLoading(true);
    queryParams.current['skip'] += 1
    const {data} = await listAllNotifications({
      start_time: Math.round(Date.now()/1000 - SEARCH_DAY_BEFORE),
      end_time: Math.round(Date.now()/1000),
      log_levels: [LogLevel.Info],
      ...queryParams.current
    })
    setLoading(false);

    if(!totalCount) {
      setTotalCount(data.total)
    }

    const prevNotiList = isReset? []: notiList;
    const concatedList = [...prevNotiList, ...convertNotiDisapy(data.data)]
    setNotiList(concatedList)
    setHasMore(concatedList.length < totalCount)

  }

  useEffect(()=>{
    setUnreadCount(unread)
  }, [unread])

  useEffect(()=>{
    if (open) {
      queryParams.current['skip'] = -1

      setNotiList([]);
      (async()=>{
        await fetchNotifications(true)
      })()
    }

  }, [open])

  return (
    <Box className="NotificationPanel">
      <IconButton onClick={onNotificationClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popper open={open} anchorEl={anchorEl} placement='bottom' transition  sx={{width: '20rem', maxHeight: '50vh', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Backdrop
                sx={{ position: "absolute", color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              {notiList.length > 0?
                <List
                  dense={true}
                  sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                  subheader={
                  <ListSubheader className="header" sx={{display: "flex", justifyContent: "space-between", top: 'inherit'}}>
                    <div className="title">
                      Notifications
                    </div>
                    <div className="clear">
                      <Link href="#" onClick={onMarkAllRead}>Mark all read</Link>
                    </div>

                  </ListSubheader>
                  }
                  >
                    <InfiniteScroll
                      dataLength={notiList.length}
                      next={fetchNotifications}
                      hasMore={hasMore}
                      loader={<h4>Loading...</h4>}
                      height={ LIST_ITEM_HEIGHT*(MIN_LIST_LENGTH-1)}
                      endMessage={
                        <p style={{ textAlign: "center" }}>
                          <b>There is no notification</b>
                        </p>
                      }
                    >

                  {notiList.map((noti, index)=>
                    {
                    return <ListItemButton key={'noti_'+index} onClick={()=>onNotiItemClick(noti.notification_id, noti.is_read, noti.link)}>
                      <ListItemAvatar>
                        <Avatar alt={noti.sender.username} src={noti.sender.avatar}/>
                      </ListItemAvatar>
                      <ListItemText primary={noti.context} secondary={TimeFormatter.timeSince(new Date(noti.create_time))} />
                      {!noti.is_read && <Brightness1RoundedIcon color="success" sx={{ fontSize: 10}} fontSize="small" />}
                    </ListItemButton >}
                  )}
                  </InfiniteScroll>
                </List>:<Typography sx={{ p: 2 }}>There is no notification.</Typography>
              }
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default NotificationPanel;
