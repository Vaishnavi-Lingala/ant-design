import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import checkIcon from '../../../assets/check.svg'
import errorIcon from '../../../assets/error.svg'
import infoIcon from '../../../assets/info.svg'
import warningIcon from '../../../assets/warning.svg'

import { StoreContext } from '../../../helpers/Store';

import './Toast.css';

const Toast = (props) => {
    const { position, autoDelete, autoDeleteTime } = props;
    const [list, setList] = useState([]);
    const [toastList, setToastList] = useContext(StoreContext);

    useEffect(() => {
        setList(toastList);
    }, [toastList, list]);

    useEffect(() => {
        console.log('toast list: ', toastList);
        console.log('list: ', list);
        const interval = setInterval(() => {
            if (autoDelete && toastList.length && list.length) {
                deleteToast(toastList[0].id);
            }
        }, autoDeleteTime);

        return () => {
            clearInterval(interval);
        }

        // eslint-disable-next-line
    }, [autoDelete, autoDeleteTime, list]);

    const deleteToast = id => {
        const toastListItem = toastList.findIndex(e => e.id === id);
        toastList.splice(toastListItem, 1);
        setList([...toastList]);
    }

    return (
        <div className={`notification-container ${position}`}>
            {list.map((toast, i) => {
                return (
                    <div
                        key={i}
                        className={`notification toast ${position}`}
                        style={{ backgroundColor: toast.backgroundColor }}
                    >
                        <button onClick={() => deleteToast(toast.id)}>
                            X
                        </button>
                        <div className='notification-image'>
                            <img src={toast.icon} alt="" />
                        </div>
                        <div>
                            <p className='notification-title'>{toast.title}</p>
                            <p className='notification-message'>{toast.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
};

export function showToast(type, description) {
    let toastProperties = null;
    const id = Math.floor((Math.random() * 100) + 1);

    switch (type) {
        case 'success':
            toastProperties = {
                id,
                title: 'Success',
                description,
                backgroundColor: '#5cb85c',
                icon: checkIcon
            }
            break;
        case 'error':
            toastProperties = {
                id,
                title: 'Danger',
                description,
                backgroundColor: '#d9534f',
                icon: errorIcon
            }
            break;
        case 'info':
            toastProperties = {
                id,
                title: 'Info',
                description,
                backgroundColor: '#5bc0de',
                icon: infoIcon
            }
            break;
        case 'warning':
            toastProperties = {
                id,
                title: 'Warning',
                description,
                backgroundColor: '#f0ad4e',
                icon: warningIcon
            }
            break;
        default:
            break;
    }

    return toastProperties;
}

Toast.defaultProps = {
    position: 'top-right',
    autoDelete: true,
    autoDeleteTime: 5000
}

Toast.propTypes = {
    position: PropTypes.string.isRequired,
    autoDelete: PropTypes.bool,
    autoDeleteTime: PropTypes.number
}

export default Toast;