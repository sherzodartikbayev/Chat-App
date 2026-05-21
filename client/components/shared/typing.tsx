import { useState, useEffect } from 'react'

type TypingProps = {
	user: string
}

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

const Typing = ({ user }: TypingProps) => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setIsVisible(true)
	}, [])

	return (
		<div
			className={`flex items-center gap-2 px-1 py-2 md:px-4 md:py-2 transition-all duration-300 ${
				isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
			}`}
		>
			<div className='relative shrink-0'>
				<div>
					<div
						className={`absolute -inset-0.5 rounded-full bg-linear-to-r ${getAvatarColor(
							user,
						)} opacity-20 blur-sm animate-pulse`}
					/>
				</div>
				<div
					className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr ${getAvatarColor(
						user,
					)} text-sm font-bold text-white shadow-lg md:h-12 md:w-12 md:text-base`}
				>
					{user.charAt(0).toUpperCase()}
				</div>
			</div>

			<div className='relative flex items-center gap-1 rounded-2xl bg-slate-800/90 border border-slate-700/50 px-4 py-3 backdrop-blur-sm shadow-lg'>
				<div className='flex items-center gap-1'>
					<div className='h-2 w-2 rounded-full bg-slate-400 animate-[bounce_1.4s_ease-in-out_infinite]' />
					<div
						className='h-2 w-2 rounded-full bg-slate-400 animate-[bounce_1.4s_ease-in-out_infinite]'
						style={{ animationDelay: '0.2s' }}
					/>
					<div
						className='h-2 w-2 rounded-full bg-slate-400 animate-[bounce_1.4s_ease-in-out_infinite]'
						style={{ animationDelay: '0.4s' }}
					/>
				</div>
				<span className='ml-2 text-[10px] font-medium text-slate-400 md:text-xs'>
					{user} is typing...
				</span>
			</div>
		</div>
	)
}

export default Typing
