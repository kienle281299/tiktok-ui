import styles from './Home.module.scss';
import { Table } from 'react-bootstrap';

function Home() {
    return (
        <Table className={styles.table} bordered hover>
            <thead className={styles.thread}>
                <tr>
                    <th>Giờ Việt Nam</th>
                    <th>Giờ OTC</th>
                    <th></th>
                    <th>OUT</th>
                    <th>IN</th>
                    <th>Hash</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>jhon</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>jhon</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>jhon</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>jhon</td>
                </tr>
                <tr>
                    <td colSpan={2}>SUM</td>
                    <td>Mark</td>
                    <td>jhon</td>
                    <td>Mark</td>
                    <td>jhon</td>
                </tr>
                <tr>
                    <td colSpan={2}>IN-OUT</td>
                    <td>Mark</td>
                    <td colSpan={2}>jhon</td>
                    <td>Mark</td>
                </tr>
            </tbody>
        </Table>
    );
}

export default Home;
