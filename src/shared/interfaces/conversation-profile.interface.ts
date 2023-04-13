interface IConversationUser {
  userId: string;
  name: string;
  avatar: string;
  // lastLogin: string;
}
export interface IConversation {
  conversationId: string;
  userProfile: IConversationUser;
  //   updatedAt: string;
}

export interface IConversationSocket {
  conversationId: string;
  userProfile: IConversationUser;
  //   updatedAt: string;
  sendUserId: string;
}

export interface IConversationProfile {
  conversationId: string;
  userId: string;
}
