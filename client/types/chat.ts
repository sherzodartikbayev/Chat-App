export interface User {
	id: string
	name: string
}

export type MessageType = 'text' | 'image' | 'server'

export interface ChatMessage {
	content: string
	type: MessageType
	user?: User
}