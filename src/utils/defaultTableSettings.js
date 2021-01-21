const sortOptionsDefault = [
	{
		value: 'updated_at|desc',
		label: 'Last update (newest first)'
	},
	{
		value: 'updated_at|asc',
		label: 'Last update (oldest first)'
	},
	{
		value: 'id|desc',
		label: 'Total orders (high to low)'
	},
	{
		value: 'id|asc',
		label: 'Total orders (low to high)'
	}
];

const applyFilters = (data, query, filters, properties = []) => {
	return data.filter((el) => {
		try {
			let matches = true;

			if (query) {
				let containsQuery = false;

				properties.forEach((property) => {
					if (String(el[property]).toLowerCase().includes(query.toLowerCase())) {
						containsQuery = true;
					}
				});

				if (!containsQuery) {
					matches = false;
				}
			}

			Object.keys(filters).forEach((key) => {
				const value = filters[key];

				if (value && el[key] !== value) {
					matches = false;
				}
			});

			return matches;
		} catch (err) {
			console.log('error:', err);
			return false;
		}
	});
};

const applyPagination = (data, page, limit) => {
	return data.slice(page * limit, page * limit + limit);
};

const descendingComparator = (a, b, orderBy) => {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}

	if (b[orderBy] > a[orderBy]) {
		return 1;
	}

	return 0;
};

const getComparator = (order, orderBy) => {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
};

const applySort = (data, sort) => {
	const [orderBy, order] = sort.split('|');
	const comparator = getComparator(order, orderBy);
	const stabilizedThis = data.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);

		if (order !== 0) return order;

		return a[1] - b[1];
	});

	return stabilizedThis.map((el) => el[0]);
};

const handleDeleteAllSelected = (selected, cbDelete, cdReset, enqueue, intl) => {
	if(!window.confirm(intl.formatMessage(intl.alertDelete))) return;

	cbDelete(selected);

	enqueue(
		intl.formatMessage(intl.eliminatedSuccess),
		{ variant: 'success' }
	)
	cdReset([]);
}

const handleDelete = (id, cbDelete, enqueue, intl) => {
	if(!window.confirm(intl.formatMessage(intl.alertDelete))) return;
	cbDelete(id);
	enqueue(
		intl.formatMessage(intl.eliminatedSuccess),
		{ variant: 'success' }
	)
}

export {
	applySort,
	handleDelete,
	applyFilters,
	getComparator,
	applyPagination,
	sortOptionsDefault,
	descendingComparator,
	handleDeleteAllSelected,
}