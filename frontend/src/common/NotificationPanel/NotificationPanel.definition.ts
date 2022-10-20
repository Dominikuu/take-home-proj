export const SEARCH_DAY_BEFORE = 60 * 60 * 24*24

export interface NotiItem {
  notification_id: string;
  create_time: number
  sender: {
    avatar: string;
    username: string;
  },
  is_read: boolean,
  context: string,
  link: {
    post_id?: string;
    comment_id?: string;
  },
  type: NotiType,
  action: NotiAction
}

export enum NotiType{
    SYSTEM = "SYSTEM",
    POST = "POST",
    REPLY = "REPLY",
    LIKE = "LIKE"
}

export enum NotiAction{
    ADD = "ADD",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export const NOTI_CONTEXT = {
    [NotiType.SYSTEM]:{
      [NotiAction.ADD]: '{sender.username} announce a news "{content}" to everyone',
      [NotiAction.UPDATE]: '',
      [NotiAction.DELETE]: ''
    },
    [NotiType.POST]:{
      [NotiAction.ADD]: '{sender.username} post new article "{content}"',
      [NotiAction.UPDATE]: '{sender.username} update "{content}"',
      [NotiAction.DELETE]: ''
    },
    [NotiType.REPLY]:{
      [NotiAction.ADD]: '{sender.username} reply you about "{content}"',
      [NotiAction.UPDATE]: '',
      [NotiAction.DELETE]: ''
    },
    [NotiType.LIKE]:{
      [NotiAction.ADD]: '{sender.username} like your article "{content}"',
      [NotiAction.UPDATE]: '',
      [NotiAction.DELETE]: ''
    },
}

