import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import checkIcon from '../../../assets/check.svg'
import errorIcon from '../../../assets/error.svg'
import infoIcon from '../../../assets/info.svg'
import warningIcon from '../../../assets/warning.svg'

import './Toast.css';

const Toast = (props) => {
    const { toastList, position, autoDelete, autoDeleteTime } = props;
    const [list, setList] = useState(toastList);

    useEffect(() => {
        setList(toastList);
    }, [toastList, list]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (autoDelete && toastList.length && list.length) {
                deleteToast(toastList[0].id);
            }
        }, autoDeleteTime);

        return () => {
            clearInterval(interval);
        }

        // eslint-disable-next-line
    }, [toastList, autoDelete, autoDeleteTime, list]);

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

export function showToast(type) {
    console.log('showToast');
    let toastProperties = null;
    const id = Math.floor((Math.random() * 100) + 1);

    switch (type) {
        case 'success':
            toastProperties = {
                id,
                title: 'Success',
                description: 'This is a success toast component',
                backgroundColor: '#5cb85c',
                icon: checkIcon
            }
            break;
        case 'danger':
            toastProperties = {
                id,
                title: 'Danger',
                description: 'This is an error toast component',
                backgroundColor: '#d9534f',
                icon: errorIcon
            }
            break;
        case 'info':
            toastProperties = {
                id,
                title: 'Info',
                description: 'This is an info toast component',
                backgroundColor: '#5bc0de',
                icon: infoIcon
            }
            break;
        case 'warning':
            toastProperties = {
                id,
                title: 'Warning',
                description: 'This is a warning toast component',
                backgroundColor: '#f0ad4e',
                icon: warningIcon
            }
            break;
        default:
            break;
    }
}

Toast.defaultProps = {
    toastList: [],
    position: 'top-right',
    autoDelete: true,
    autoDeleteTime: 3000
}

Toast.propTypes = {
    toastList: PropTypes.array.isRequired,
    position: PropTypes.string.isRequired,
    autoDelete: PropTypes.bool,
    autoDeleteTime: PropTypes.number
}

export default Toast;