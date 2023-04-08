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
