import React, { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
	Box,
	Button,
	Card,
	TextField,
	CardContent,
	makeStyles, Grid
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import httpClient from 'src/utils/httpClient';

const useStyles = makeStyles((theme) => ({
	root: {},
	queryField: {
		width: 500
	},
	bulkOperations: {
		position: 'relative'
	},
	bulkActions: {
		paddingLeft: 4,
		paddingRight: 4,
		marginTop: 6,
		position: 'absolute',
		width: '100%',
		zIndex: 2,
		backgroundColor: theme.palette.background.default
	},
	bulkAction: {
		marginLeft: theme.spacing(2)
	},
	avatar: {
		height: 42,
		width: 42,
		marginRight: theme.spacing(1)
	}
}));

const Results = ({
	className,
	...rest
}) => {
	const classes = useStyles();
	const [content, setContent] = React.useState("")
	const { enqueueSnackbar } = useSnackbar();

	const handleContent = (event) => {
		setContent(event.target.value);
	};

	const getSOScontacts = useCallback(async () => {
		httpClient.get('api/privacy')
		.then(json => {
			if (json.status) {
				setContent(json.data.content ? json.data.content : '');
			}
			else {
				enqueueSnackbar('Data loading failed!', {
					variant: 'error'
				});
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}, [enqueueSnackbar]);

	useEffect(() => {
		getSOScontacts();
	}, [getSOScontacts])

	const handlesubmit = () => {
		if (content === '')
			return
		httpClient.put('api/privacy/edit', {content: content})
			.then(json => {
				if (json.status) {
					enqueueSnackbar('It was updated successfully.', {
						variant: 'success'
					});
					getSOScontacts();
				}
			})
			.catch((error) => {
				enqueueSnackbar('failed.', {
					variant: 'error'
				});
			});
	}
	return (
		<Card
			className={clsx(classes.root, className)}
			{...rest}
		>
			<PerfectScrollbar>
				<Box minWidth={700}>
					<CardContent>
						<Grid
							container
							spacing={3}
							style={{ marginTop: 30 }}
						>

							<Grid
								md={6}
								xs={12}
								style={{ textAlign: 'center' }}
								item
							>
								Contenido:
							</Grid>
							<Grid
								md={5}
								xs={12}
								item
							>
								<TextField
									fullWidth
									name="name"
									multiline
									rows={30}
									value={content}
									variant="outlined"
									onChange={handleContent}
								/>
							</Grid>
							<Grid
								md={6}
								xs={12}
								item
							></Grid>
							<Grid
								md={5}
								xs={12}
								item
							>
								<Box mt={2} style={{ textAlign: 'right' }}>
									<Button
										variant="contained"
										color="secondary"
										onClick={handlesubmit}
									>
										Guardar
								</Button>
								</Box>
							</Grid>

						</Grid>
					</CardContent>
				</Box>
			</PerfectScrollbar>
		</Card>
	);
};

Results.propTypes = {
	className: PropTypes.string,
};

export default Results;
