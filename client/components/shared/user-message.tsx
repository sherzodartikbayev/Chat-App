import { ChatListMessage } from '@/types/chat'
import { useEffect, useState } from 'react'

type MessageProps = Pick<ChatListMessage, 'content' | 'type' | 'own' | 'user'>

const UserMessage = ({ content, type, own, user }: MessageProps) => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setIsVisible(true)
	}, [])

	const getAvatarColor = (name: string) => {
		const colors = [
			'from-sky-500 to-cyan-500',
			'from-violet-500 to-purple-500',
			'from-emerald-500 to-teal-500',
			'from-rose-500 to-pink-500',
			'from-amber-500 to-orange-500',
			'from-indigo-500 to-blue-500',
		]
		const index = name.charCodeAt(0) % colors.length
		return colors[index]
	}

	return (
		<div
			className={`group flex items-end gap-2 px-1 py-2 md:px-4 md:py-2 ${own ? 'justify-end' : 'justify-start'} transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
		>
			{!own && user && (
				<div className='relative shrink-0'>
					<div
						className={`absolute -inset-0.5 rounded-full bg-linear-to-r ${getAvatarColor(
							user.name,
						)} opacity-20 blur-sm group-hover:opacity-40 transition-opacity`}
					/>
					<div
						className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr ${getAvatarColor(
							user.name,
						)} text-sm font-bold text-white shadow-lg transition-transform group-hover:scale-110 md:h-12 md:w-12 md:text-base`}
					>
						{user.name.charAt(0).toUpperCase()}
					</div>
				</div>
			)}

			{!own && user && (
				<span className='text-[10px] font-medium text-slate-400 px-2'>
					{user.name}
				</span>
			)}
			<div
				className={`group/message relative rounded-2xl px-4 py-2.5 shadow-lg transition-all duration-300 hover:shadow-xl ${
					own
						? 'bg-linear-to-br from-sky-500 via-cyan-400 to-violet-500 text-white rounded-br-md'
						: 'bg-slate-800/90 text-slate-100 border border-slate-700/50 rounded-bl-md backdrop-blur-sm'
				} ${type === 'image' ? 'p-2' : ''}`}
			>
				{own && (
					<div className='pointer-events-none absolute -inset-0.5 rounded-2xl bg-linear-to-br from-sky-400/30 to-violet-400/30 blur opacity-0 group-hover/message:opacity-100 transition-opacity' />
				)}
				{type === 'text' ? (
					<p className='relative z-10 text-sm leading-relaxed md:text-base wrap-break-word'>
						{content}
					</p>
				) : (
					<div className='relative z-10 overflow-hidden rounded-lg'>
						<img
							src={content}
							className='max-h-64 w-auto rounded-lg object-cover shadow-md transition-transform hover:scale-[1.02]'
							alt='Shared image'
						/>
					</div>
				)}

				<div
					className={`absolute -bottom-5 text-[9px] text-slate-500 opacity-0 group-hover/message:opacity-100 transition-opacity ${own ? 'right-2' : 'left-2'}`}
				>
					{new Date().toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					})}
				</div>

				{own && (
					<div className='relative shrink-0'>
						<div className='absolute -inset-0.5 rounded-full bg-linear-to-r from-sky-500/20 to-violet-500/20 opacity-0 blur-sm group-hover:opacity-40 transition-opacity' />
						<div className='relative flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-sky-500 to-violet-500 text-xs font-bold text-white shadow-lg transition-transform group-hover:scale-110 md:h-10 md:w-10 md:text-sm'>
							{user?.name.charAt(0).toUpperCase() || 'You'}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default UserMessage
