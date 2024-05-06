import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import React from 'react';
import axios from 'axios';

import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAddress, truncateAddress } from 'src/common';
import clsx from 'clsx';
import { Table, Button, Tooltip, Modal, Form, Row, Col, FloatingLabel } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';

const pageSize = 12;
const cx = classNames.bind(styles);

function Sidebar() {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Loading...
        </Tooltip>
    );
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [usdtData, setUsdtData] = useState({
        count: 0,
        data: [],
    });
    // const lastItem = getLastItem(usdtData.count);
    console.log(usdtData);
    // function getLastItem(arr) {
    //     if (!Array.isArray(arr) || arr.length === 0) {
    //         return null; // Trả về null nếu đầu vào không phải là một mảng hoặc mảng rỗng
    //     }

    //     return arr[arr.length - 1]; // Trả về phần tử cuối cùng của mảng
    // }
    const [error, setError] = useState(null);

    const [disabledButtons, setDisabledButtons] = useState(1);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [address, setAddress] = useState({ value: '', error: false });
    const [fromDate, setFromDate] = useState({ value: '', error: false });
    const [toDate, setToDate] = useState({ value: '', error: false });

    useEffect(() => {
        // setIsLoading(true);
        getListQuery();
    }, []);

    function validSubmit() {
        let isValid = true;

        // check adress valid
        if (address.value === '') {
            setAddress({
                ...address,
                error: true,
            });
            isValid = false;
        }
        if (!isAddress(address.value)) {
            setAddress({
                ...address,
                error: true,
            });
            isValid = false;
        }

        // // check from null
        if (fromDate.value === '') {
            setFromDate({
                ...fromDate,
                error: true,
            });
            isValid = false;
        }
        // // check to null
        if (toDate.value === '') {
            setToDate({
                ...toDate,
                error: true,
            });
            isValid = false;
        }
        // // check from <  to
        const fromDateMoment = moment(fromDate.value);
        const toDateMoment = moment(toDate.value);
        if (!fromDateMoment.isSameOrBefore(toDateMoment)) {
            setToDate({
                ...toDate,
                error: true,
            });
            isValid = false;
        }

        return isValid;
    }

    function handleSubmitQuery() {
        if (!validSubmit()) {
            toast.error('Error');

            return;
        }
        handleClose();
        createQuery(postData);
        getListQuery();
        setIsLoading(true);
    }

    const getListQuery = (page = 0) => {
        setIsLoading(true);

        fetch(`https://api-testnet.metahub.finance/usdtTrackerQueries?page=${page}`)
            .then((response) => {
                // set loading = false;
                setIsLoading(false);

                if (!response.ok) {
                    throw new Error('123');
                }
                return response.json();
            })
            .then((data) => {
                // set loading = false;
                setIsLoading(false);

                setUsdtData(data.data);
            })
            .catch((error) => {
                // set loading = false;
                setIsLoading(false);

                setError(error);
            });
    };

    const createQuery = (data) => {
        console.log(data);
        // Gửi yêu cầu POST đến API
        fetch(`https://api-testnet.metahub.finance/usdtTrackerQueries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Chuyển đối tượng thành chuỗi JSON
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to post data to API'); // Nếu không thành công, ném lỗi
                }
                return response.json(); // Trả về dữ liệu từ phản hồi
            })
            .then((data) => {
                console.log(data); // Xử lý dữ liệu phản hồi
                getListQuery();
                handleClose();
            })
            .catch((error) => {
                console.error('Error posting data to API:', error); // Xử lý lỗi
            });
    };

    // Dữ liệu gửi đi
    const postData = {
        address: address.value,
        from: fromDate.value,
        to: toDate.value,
    };

    const handleChangePage = (page) => {
        getListQuery(page - 1);
    };

    const renderListPagination = () => {
        let html = [];

        for (let index = 1; index <= Math.ceil(usdtData.count / pageSize); index++) {
            html.push(
                <button
                    key={index}
                    className={styles.itemPage}
                    disabled={disabledButtons === index}
                    onClick={() => {
                        handleChangePage(index);
                        setDisabledButtons(index);
                    }}
                >
                    {index}
                </button>,
            );
        }

        return html;
    };

    return (
        <aside className={cx('wrapper')}>
            <ToastContainer />
            <>
                <Button className={styles.add} variant="primary" onClick={handleShow}>
                    <i className="fa-solid fa-plus"> Query request</i>
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>New wallet address</Form.Label>
                                <div
                                    className={clsx({
                                        [styles.hasError]: address.error,
                                    })}
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        autoFocus
                                        value={address.value}
                                        onChange={(e) => setAddress({ value: e.target.value, error: false })}
                                    />
                                </div>
                            </Form.Group>
                            <Row className="g-2">
                                <Col md>
                                    <div
                                        className={clsx({
                                            [styles.hasError]: fromDate.error,
                                        })}
                                    >
                                        <FloatingLabel controlId="floatingInputGrid" label="From">
                                            <Form.Control
                                                type="date"
                                                autoFocus
                                                value={fromDate.value}
                                                onChange={(e) => setFromDate({ value: e.target.value, error: false })}
                                            />
                                        </FloatingLabel>
                                    </div>
                                </Col>
                                <Col md>
                                    <div
                                        className={clsx({
                                            [styles.hasError]: toDate.error,
                                        })}
                                    >
                                        <FloatingLabel controlId="floatingInputGrid" label="To">
                                            <Form.Control
                                                type="date"
                                                autoFocus
                                                value={toDate.value}
                                                onChange={(e) => setToDate({ value: e.target.value, error: false })}
                                            />
                                        </FloatingLabel>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmitQuery}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <Table bordered hover variant="white">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Address</th>
                        <th>Time</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {error && <p>{error.message}</p>}
                    {usdtData &&
                        usdtData.data.map((item, index) => (
                            <tr key={index}>
                                <td className={styles.stt}>{index + 1}</td>
                                <td className={styles.href}>
                                    <CopyToClipboard
                                        text={item.address}
                                        onCopy={(text, result) => {
                                            toast.success('Coppy thành công');
                                        }}
                                    >
                                        <a className={styles.coppy}>{truncateAddress(item.address, 5)}</a>
                                    </CopyToClipboard>
                                </td>
                                <td className={styles.time}>
                                    {moment(item.from).format('MM/DD/YYYY')} - {moment(item.to).format('MM/DD/YYYY')}
                                </td>
                                <td>
                                    <Button variant="success">{item.status}</Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            {renderListPagination()}

            {isLoading && (
                <div className={styles.isLoading}>
                    <div className={cx('la-ball-atom')}>
                        123
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
