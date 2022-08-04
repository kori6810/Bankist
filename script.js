'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Sirojiddin Kamoljonov',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementDates:[
    '2022-06-01T15:00:00.000Z',
    '2022-06-03T15:00:00.000Z', 
    '2022-06-04T15:00:00.000Z', 
    '2022-06-11T15:00:00.000Z', 
    '2022-06-14T15:00:00.000Z', 
    '2022-06-15T15:00:00.000Z', 
    '2022-06-15T15:00:00.000Z', 
    '2022-06-16T15:00:00.000Z'
  ]
};

const account2 = {
  owner: 'Farhod Fozilov',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementDates:[
    '2022-01-21T15:00:00.000Z', 
    '2022-01-23T15:00:00.000Z', 
    '2022-01-24T15:00:00.000Z', 
    '2022-02-21T15:00:00.000Z', 
    '2022-02-28T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z'
  ]
};

const account3 = {
  owner: 'Billy Hope',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementDates:[
    '2022-01-21T15:00:00.000Z', 
    '2022-05-23T15:00:00.000Z', 
    '2022-05-24T15:00:00.000Z', 
    '2022-05-21T15:00:00.000Z', 
    '2022-05-28T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z'
  ]
};

const account4 = {
  owner: 'Will Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementDates:[
    '2022-01-21T15:00:00.000Z', 
    '2022-01-23T15:00:00.000Z', 
    '2022-01-24T15:00:00.000Z', 
    '2022-02-21T15:00:00.000Z', 
    '2022-02-28T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z', 
    '2022-03-01T15:00:00.000Z'
  ]
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const formatMovementDate = function(date){
  const calcDaysPassed = (date1, date2)=> {
    // console.log(date1)
    // console.log(date2)
    return Math.round(Math.abs((date2-date1)/(1000*60*60*24)))
  }
  const daysPassed = calcDaysPassed(new Date(), new Date(date))
  // console.log(daysPassed)

  if (daysPassed===0) return 'Today'
  else if( daysPassed === 1) return 'Yesterday'
  else if(daysPassed<=7) return `${daysPassed} day ago`
  else {
   const movDate = new Date(date)
   const options = {  
       day:'numeric',
       month:'numeric',
       year:'numeric'
   }
   return `${new Intl.DateTimeFormat('en-US',options).format(movDate)}`
  
  
  }
  
  

   
  


}


//////////MOVEMENTS DISPLAY
const displayMovements = function (acc, sort = false){
  containerMovements.innerHTML = "";

  const movs = sort? acc.movements.slice().sort((a,b)=> a-b) : acc.movements


  movs.forEach((movement,index) => {
    let type = movement>0 ? 'deposit' : 'withdrawal'
    
    
    const displayDate = formatMovementDate(acc.movementDates[index])
    
    
   
    

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${movement.toFixed(2)}€</div>
    </div>`
    containerMovements.insertAdjacentHTML("afterbegin",html)
    
  });
}
/////////SORT BTN////////
let sorted = false
btnSort.addEventListener('click', function(){
  displayMovements(currentAccount,!sorted)
  sorted = !sorted
  if(logOutTimer) clearInterval(logOutTimer)
  logOutTimer = funcLogOut()
})





/////////USERNAME FUNCTION//////
const creatUsername = function(accs){
   accs.forEach(acc => {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('')
    
     
   });
}
creatUsername(accounts)


//////////DISPLAY BALANCE////////
const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((sum,cur)=> sum+cur,0)
  labelBalance.textContent = `${acc.balance.toFixed(2)}` 

  
}



////////DISPLAY SUMMARY(IN,OUT,INTEREST)/////
const calcDisplaySummary = (acc) => {
  const incomes =acc.movements
  .filter(mov => mov>0)
  .reduce((sum,mov)=>sum+mov,0)

  
  const outcomes =Math.abs(acc.movements
    .filter(mov => mov<0)
    .reduce((sum,mov)=>sum+mov,0))

  
    const interest = acc.movements
  .filter(move=> move>1)
  .map(mov => 0.012*mov)
  .reduce((sum,mov)=> sum+mov,0)



  labelSumIn.textContent = `${incomes.toFixed(2)}`
  labelSumOut.textContent = `${outcomes.toFixed(2)}`
  labelSumInterest.textContent = `${interest.toFixed(2)}`
}

//////////UPDATING UI//////////
const updateUI = acc =>{
 //////Display Movements/////
 displayMovements(acc)
 //////Display Balance/////
 calcDisplayBalance(acc)
 //////Display Summary/////
 calcDisplaySummary(acc)
 /////Clear inputs//////
}

const funcLogOut = ()=>{
  let time = 300
  const tick = ()=>{
    time--
    let min = String(Math.trunc(time/60)).padStart(2,0)
    let sec = String(time%60).padStart(2,0)
    labelTimer.textContent = `${min}:${sec}`
    if (time===0){
      clearInterval(logOutTimer)
      labelWelcome.textContent='Login to get started'
      containerApp.style.opacity = 0


    }
  }
  tick()
  const logOutTimer = setInterval( tick ,1000)
  return  logOutTimer



}
///////////IMPLEMENTING LOGIN////////
let currentAccount, logOutTimer
btnLogin.addEventListener('click', function(e){
  e.preventDefault()
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  // console.log(currentAccount)
  if (currentAccount?.pin === +inputLoginPin.value){
    //////////welcome message & displaying UI
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 1
     
    updateUI(currentAccount)
    const now = new Date()
    const options = {
      hour:'numeric',
      minute:'numeric',
      day:'numeric',
      month:'2-digit',
      year:'numeric'
    }
    const currentDate = new Intl.DateTimeFormat('Uz-uz',options).format(now)
    labelDate.textContent = `${currentDate}`
    ////////////////Error/////
    if(logOutTimer) clearInterval(logOutTimer)
    logOutTimer = funcLogOut()

   
    inputLoginUsername.value = inputLoginPin.value =''
    inputLoginUsername.blur()
    inputLoginPin.blur()
  }
})


///////////IMPLENTING TRANSFER////////
btnTransfer.addEventListener('click', function(e){
  e.preventDefault()
  const amount = +inputTransferAmount.value
  const reciever = accounts.find(acc => acc.username === inputTransferTo.value)
  // console.log('amount:',amount)
  // console.log(reciever)

  if(amount>0 &&
    reciever && 
    reciever.username !== currentAccount.username && 
    amount<currentAccount.balance){
      currentAccount.movements.push(-amount)
      currentAccount.movementDates.push(new Date().toISOString())
      reciever.movements.push(amount)
      reciever.movementDates.push(new Date().toISOString())

  }
  

  updateUI(currentAccount)
  if(logOutTimer) clearInterval(logOutTimer)
  logOutTimer = funcLogOut()

  inputTransferAmount.value = inputTransferTo.value = ''
  inputTransferAmount.blur()
  inputTransferTo.blur()
 
})
//////////DELETING ACC///////

btnClose.addEventListener('click', function(e){
  e.preventDefault()
  if (currentAccount.username === inputCloseUsername.value &&
  currentAccount.pin === +inputClosePin.value ){
    
    const index = accounts.findIndex(acc => acc.username === inputCloseUsername.value)
    accounts.splice(index,1)
  }
  containerApp.style.opacity = 0
  labelWelcome.textContent = `Log in to get started🙈`


})


///////Displaying Cur TIME//////
// const currentDate = new Date()

// const year = currentDate.getFullYear()
// console.log(year)
// const month = `${currentDate.getMonth()+1}`.padStart(2,0)
// console.log(month)
// const day = `${currentDate.getDate()}`.padStart(2,0)
// console.log(day)
// const hour = `${currentDate.getHours()}`.padStart(2,0)
// console.log(hour)
// const minutes = `${currentDate.getMinutes()}`.padStart(2,0)
// labelDate.textContent = ` ${year} / ${month} / ${day} - ${hour}:${minutes}`


const now = new Date()
const currentDate = new Intl.DateTimeFormat('Uz-uz').format(now)
labelDate.textContent = `${currentDate}`


  

  



