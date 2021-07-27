import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    root: { 
        margin: '20px'
    },
    table: {
      width: 300,
      margin: '20px'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

export const Home = () => {
    const classes = useStyles();

    // This will hold the list of users
    const [users, setUsers] = useState([]);
    // this will hold the list of user count by age based on the user's item
    const [userAgeCount, setUserAgeCount] = useState([]);
    // this will hold the list of items to be displayed in dropdown for filter
    const [items, setItems] = useState([]);

    // this holds slected item when user selects an items from dropdown list
    const [item, setItem] = useState('');

    // API call to fetch users details
    useEffect(() => {
        fetch('/users')
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setUsers(json);
        })
        
    },[]);

    // API call ro fetch the items details
    useEffect(() => {
        fetch('/items')
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setItems(json);
        });
    },[])

    // API to fetch the list of user count by age based on the user's item
    useEffect(() => {
        if (item !== '') {
            fetch('/users/age?lookupItem='+item)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                setUserAgeCount(json);
            });
        }
    }, [item]);

    // Function to handle item change from dropdowns
    const handleChange = (event) => {
        setItem(event.target.value);
    };

    return (
        <React.Fragment>
            <div className={classes.root}>
            <Typography variant="h4">All Users</Typography>
            <Typography variant="subtitle1">Users and their age</Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell align="right">Age</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.username}>
                            <TableCell component="th" scope="row">
                                {user.username}
                            </TableCell>
                            <TableCell align="right">{user.age}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
            <div className={classes.root}>
            <Typography variant="h4">Age Demographic of User With {item}</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Item</InputLabel>
                <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={item}
                onChange={handleChange}
                label="Item"
                >
                {items.map(item => (<MenuItem value={item}>{item}</MenuItem>))}
                </Select>
            </FormControl>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell align="right">Age</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {userAgeCount.map((userAgeCount) => (
                        <TableRow key={userAgeCount.age}>
                            <TableCell component="th" scope="row">
                                {userAgeCount.age}
                            </TableCell>
                            <TableCell align="right">{userAgeCount.count}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        </React.Fragment>
    )
}