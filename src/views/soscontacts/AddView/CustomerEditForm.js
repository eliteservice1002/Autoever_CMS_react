import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	TextField,
} from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Styles from '../style.module.css';
import { useHistory } from 'react-router-dom'
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const CustomerEditForm = ({
	intl,
	className,
	...rest
}) => {
	const { enqueueSnackbar } = useSnackbar();
	const [statevalues, setValues] = React.useState({
		name: '',
		name_us: '',
		telephone: '',
	});
	const [isSubmitting] = React.useState(false);
	const [namevalidate, setNamevalidate] = React.useState(false)
	const [nameusvalidate, setNameusvalidate] = React.useState(false)
	const [telephonevalidate, setTelvalidate] = React.useState(false)
	const history = useHistory();

	const handleChangePassword = (prop) => (event) => {
		setValues({ ...statevalues, [prop]: event.target.value });
	};

	const handleSubmt = () => {
		if (statevalues.name === "")
			setNamevalidate(true)
		else
			setNamevalidate(false)
		if (statevalues.name_us === "")
			setNameusvalidate(true)
		else
			setNameusvalidate(false)
		if (statevalues.telephone === "")
			setTelvalidate(true)
		else
			setTelvalidate(false)

		let submitflag = false;
		if (statevalues.name !== "" && statevalues.name_us !== "" && statevalues.telephone !== "")
			submitflag = true;

		if (submitflag) {
			httpClient.post('api/soscontacts/create', {
				name: statevalues.name,
				name_us: statevalues.name_us,
				telephone: statevalues.telephone,
			})
				.then(json => {
					if (json.status) {
						enqueueSnackbar('It was added successfully.', {
							variant: 'success'
						});
						history.push(formatMessage(intl.urlSosContacts))
					}
				})
				.catch((error) => {
					enqueueSnackbar('Addition has failed.', {
						variant: 'error'
					});
				});
		}
	}

	return (
		<Formik>
			<Card>
				<CardContent>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							md={6}
							xs={12}
						>
							<TextField
								fullWidth
								label="Nombre"
								name="name"
								required
								onChange={handleChangePassword('name')}
								value={statevalues.name}
								variant="outlined"
							/>
							{namevalidate && (
								<p style={{ color: '#ff0000' }}>please fill out this field.</p>
							)}
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<PhoneIcon className={Styles.iconStyle1} />
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<PhoneIcon className={Styles.iconStyle} />
						</Grid>
						<Grid
							item
							md={6}
							xs={12}
						>
							<TextField
								fullWidth
								label="Nombre(ingles)"
								name="name"
								onChange={handleChangePassword('name_us')}
								required
								value={statevalues.name_us}
								variant="outlined"
							/>
							{nameusvalidate && (
								<p style={{ color: '#ff0000' }}>please fill out this field.</p>
							)}
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<ShoppingBasketIcon className={Styles.iconStyle1} />
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<ShoppingBasketIcon className={Styles.iconStyle} />
						</Grid>
						<Grid
							item
							md={6}
							xs={12}
						>
							<TextField
								fullWidth
								label="Telefono"
								name="name"
								onChange={handleChangePassword('telephone')}
								required
								type="number"
								value={statevalues.telephone}
								variant="outlined"
							/>
							{telephonevalidate && (
								<p style={{ color: '#ff0000' }}>please fill out this field.</p>
							)}
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<FavoriteBorderIcon className={Styles.iconStyle1} />
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<FavoriteBorderIcon className={Styles.iconStyle} />
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<Box mt={2}>
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									disabled={isSubmitting}
									onClick={handleSubmt}
								>
									Regresar
								</Button>
							</Box>
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<Box mt={2}>
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									disabled={isSubmitting}
									onClick={() => { history.push(formatMessage(intl.urlSosContacts)) }}
								>
									Guardar
								</Button>
							</Box>
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<HomeIcon className={Styles.iconStyle1} />
						</Grid>
						<Grid
							item
							md={3}
							xs={6}
							style={{ textAlign: 'center' }}
						>
							<HomeIcon className={Styles.iconStyle} />
						</Grid>
						<Grid item />
					</Grid>
				</CardContent>
			</Card>
		</Formik>
	);
};

CustomerEditForm.propTypes = {
	className: PropTypes.string
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

const mapDispatchToProps = (dispatch) => ({
	// 
})

export default connectIntl(
	mapStateToProps,
	mapDispatchToProps
)(CustomerEditForm);