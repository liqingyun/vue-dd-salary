import SalaryBill from './components/salaryBill/salaryBill'
import SalaryDetails from './components/salaryBill/salaryDetails/salaryDetails'
import SetPassword from './components/setPassword/setPassword'
import QueryPassword from './components/queryPassword/queryPassword'
import RecordDetails from './components/salaryBill/recordDetails/recordDetails'
import ForgetPassword from './components/setPassword/forgetPassword'
import LoadFailure from './components/loadFailure/loadFailure'

export const routes = [
    { path: '/', component: QueryPassword },
    { path: '/salaryBill', component: SalaryBill },
    { path: '/salaryDetails', component: SalaryDetails },
    { path: '/setPassword', component: SetPassword },
    { path: '/recordDetails', component: RecordDetails },
    { path: '/forgetPassword', component: ForgetPassword },
    { path: '/loadFailure', component: LoadFailure }
]
