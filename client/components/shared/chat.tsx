import { ChatListMessage, User } from '@/types/chat'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ServerMessage from './server-message'
import UserMessage from './user-message'
import Typing from './typing'

interface ChatProps {
	chat: ChatListMessage[]
	user: User
	typing: string[]
}

const Chat = ({ chat, typing, user }: ChatProps) => {
	const scrollerRef = useRef<HTMLDivElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)

	const [isScrolled, setIsScrolled] = useState(false)

	const handleScroll = useCallback(() => {
		const container = containerRef.current
		if (!container) return

		const { scrollTop, scrollHeight, clientHeight } = container
		const nearBottom = scrollHeight - scrollTop - clientHeight < 150

		setIsScrolled(!nearBottom)
	}, [])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		if (!isScrolled) {
			scrollerRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			})
		}
	}, [chat, typing, isScrolled])

	const messageCount = useMemo(
		() => chat.filter(m => m.type === 'server').length,
		[chat],
	)

	const onlineCount = useMemo(
		() => new Set(chat.map(m => m.user?.id).filter(Boolean)).size,
		[chat],
	)

	return (
		<section className='relative flex h-full w-full items-center justify-center px-2 md:px-4'>
			<div className='pointer-events-none absolute inset-0 bg-[radical-gradient(circle_at_top, _rgba(56, 189, 248, 0.15), _transparent_55%), radical-gradient(circle_at_bottom, _rgba(129, 140, 248, 0.15)), _transparent_50%]'>
				<div className='relative z-10 flex w-full h-full max-x-5xl flex-col rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_24px_80px_rgba(15, 23, 42, 0.95)] backdrop-blur overflow-hidden'>
					{/* Header */}
					<header className='relative flex items-center justify-between gap-3 border-b border-slate-800/80 bg-linear-to-r from-slate-950/95 px-4 py-3 md:px-6 backdrop-blur-sm'>
						<div className='pointer-events-none absolute inset-0 bg-linear-to-r from-sky-500/5 via-transparent to-violet-500/5' />

						<div className='relative z-10 flex items-center gap-3'>
							<div className='relative'>
								<div className='absolute -inset-1 rounded-full bg-linear-to-r from-sky-500/30 via-cyan-400/30 to-violet-500/30 blur opacity-60 animate-pulse' />
								<div className='relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-sky-500 to-violet-500 text-sm font-bold text-white shadow-lg'>
									{user.name.charAt(0).toUpperCase()}
								</div>
							</div>

							<div className=''>
								<h2 className='text-sm font-semibold text-slate-100 md:text-base'>
									<span className='bg-linear-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent'>
										Real time room
									</span>
								</h2>
								<p className='text-[11px] text-slate-400 md:text-xs flex items-center gap-1.5 '>
									Signed in as
									<span className='font-semibold text-sky-300'>
										{user.name}
									</span>
									{onlineCount > 1 && (
										<>
											<span className='text-slate-500'>*</span>
											<span className='text-emerald-400'>
												{onlineCount} online
											</span>
										</>
									)}
								</p>
							</div>
						</div>

						{messageCount > 0 && (
							<div className='hidden md:flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-900/60 px-2.5 py-1'>
								<span className='text-[10px] font-medium text-slate-400'>
									{messageCount}
								</span>
								<span className='text-[10px] text-slate-500'>messages</span>
							</div>
						)}
					</header>

					{/* Body */}
					<div className='relative flex-1 overflow-hidden'>
						<div
							className='relative z-10 flex h-full flex-col overflow-y-auto px-2 pb-4 pt-2 md:px-4 md:pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50 hover:scrollbar-thumb-slate-600/50'
							ref={containerRef}
						>
							{chat.map((msg, idx) => {
								const enrichedMessage: ChatListMessage = {
									...msg,
									own: msg.user?.id === user.id,
								}

								return enrichedMessage.type === 'server' ? (
									<ServerMessage key={idx} content={enrichedMessage.content} />
								) : (
									<UserMessage key={idx} {...enrichedMessage} />
								)
							})}

							{typing[0] && (
								<div
									className='transition-all duration-300 ease-out'
									style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
								>
									<Typing user={typing[0]} />
								</div>
							)}

							<div ref={scrollerRef} />
						</div>
					</div>
				</div>

				{isScrolled && (
					<button
						onClick={() => {
							scrollerRef.current?.scrollIntoView({ behavior: 'smooth' })
						}}
						className='absolute bottom-20 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-sky-500 to-violet-500 text-white shadow-lg transition-all hover:scale-110 hover:shadow-sky-500/50 md:right-8'
					>
						↓
					</button>
				)}
			</div>
		</section>
	)
}

export default Chat
