import React from 'react';
import useAuth from 'src/hooks/useAuth';


const Logo = (props) => {
	const { user, logout } = useAuth();
	const styleWapper = {
		padding: '15px',
		display: 'block',
		maxWidth: '150px',
	}

	const styleLogo = {
		width: 'auto',
		display: 'block',
		maxHeight: '35px',
	}

	const urlImage = {
		white: '/static/images/hyundai-motor-group-ci-white.svg',
		color: '/static/images/hyundai-motor-group-ci-color.svg'
	}

	const renderLogo = () => {
		let pathLogo;
		if(user && user.company) {
			let {
				full_logo_path,
				transparent_logo_path
			} = user.company;
			pathLogo = transparent_logo_path ?? full_logo_path;
		}

		if(!pathLogo) {
			pathLogo = (props.color) ? urlImage.color : urlImage.white;
		} else {
			pathLogo = process.env.REACT_APP_BASE_URL + pathLogo;
		}

		return(
			<img
				alt="Logo"
				{...props}
				src={pathLogo}
				style={styleLogo}
			/>
		)
	}

	return (
		<span style={styleWapper}>
		{renderLogo()}
		</span>
	);
}

export default Logo;
