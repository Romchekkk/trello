// Необходимо для возможности перетаскивания заданий
const {DragDropContext, Draggable, Droppable } = ReactBeautifulDnd

// Доска
class Desk extends React.Component{
    constructor(props){
        super(props)

        // Получение текущей даты в необходимом формате
        let today = new Date()
        let date = 

        // Год
        today.getFullYear() + "-" +

        // Месяц
        (((Math.round(today.getMonth())+1)+"").length==1?('0'+(Math.round(today.getMonth())+1)):(Math.round(today.getMonth())+1)) + "-" +

        // День
        (((today.getDate()+"").length==1)?('0'+today.getDate()):(today.getDate()))

        this.state = {
            // Просматривая неделя 
            // 0 - текущая неделя
            // 1 - следующая неделя (и тд)
            // -1 - предыдущая неделя (и тд)
            week: 0,

            // ID текущей доски
            id: this.props.deskId,

            // Костыль. Необходим для указания приложению о необходимости обновить компоненты доски
            update: false,

            // Отображение меню добавления задач
            // "none" - не отображать
            // "block" - отображать
            displayTaskAdder: "none",

            // Дата в меню добавления задач по умолчанию
            dateForTask: date,

            // ID заданий, которые находятся в "кармашке"
            tasksInPocket: false,
        }

        this.decrementWeek = this.decrementWeek.bind(this)
        this.incrementWeek = this.incrementWeek.bind(this)
        this.showTaskAdder = this.showTaskAdder.bind(this)
        this.hideTaskAdder = this.hideTaskAdder.bind(this)
        this.needUpdate = this.needUpdate.bind(this)
    }

    // Костыль. Необходима для указания приложению о необходимости обновить компоненты
    needUpdate(){
        let update = !this.state.update
        this.setState({
            update: update
        })
    }

    // Переход на предыдущую неделю от открытой
    decrementWeek(){
        let curWeek = this.state.week
        this.setState({
            week: curWeek-1
        })
    }

    // Переход на следующую неделю от открытой
    incrementWeek(){
        let curWeek = this.state.week
        this.setState({
            week: curWeek+1
        })
    }

    // Завершение перетаскивания
    onDragEnd = result => {
        // Параметры перетаскивания (что и куда)
        const { source, destination } = result

        // Если конечной цель переноса нет - вернуть обратно
        if (!destination) {
            return
        }

        // Если задание помещается в "кармашек"
        if (destination.droppableId == -1){
            if (source.droppableId != -1){
                let tasks = []
                if (this.state.tasksInPocket != false){
                    tasks = this.state.tasksInPocket
                }
                tasks.push(result.draggableId)
                this.setState({
                    tasksInPocket: tasks
                })
            }
        }

        // Если цель переноса есть
        else {
            console.dir(result)
            // Включаем заглушку
            document.querySelector("#loader").style.display = "";

            // Отправляем запрос в базу данных на изменение расположения задания
            let self = this
            $.ajax({
                url: "desk/dragTask.php",
                method: "post",
                data: {
                    
                    // Дата, на которую переносится задание
                    timestamp: destination.droppableId,

                    // Место в порядке заданий
                    destination: destination.index,

                    // Место, которое задание занимало
                    target: source.index,

                    // Какое задание переносится (его ID в базе данных)
                    id: result.draggableId
                },
                success: function() {

                    // Отключаем заглушку
                    document.querySelector("#loader").style.display = "none";

                    if (source.droppableId == -1){
                        let tasksInPocket = self.state.tasksInPocket
                        let index = tasksInPocket.indexOf(result.draggableId)
                        tasksInPocket.splice(index, 1)
                        self.setState({
                            tasksInPocket: tasksInPocket
                        })
                    }
                    // Обновляем компоненты
                    self.needUpdate()
                },
                async: false
            })
        }
    };

    // Отображаем меню добавления заданий
    showTaskAdder(date){
        let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
        
        // Меняем формат даты на необходимый
        let regexp = new RegExp(/[^\d]+/, 'ui')
        date = date.replace(regexp, '-'+months.indexOf(date.match(regexp)[0].trim())+'-').split(/-/)
        date[1] = Math.round(date[1])+1
        if (date[1].length == 1){
            date[1] = '0'+date[1]
        }
        if (date[0].length == 1){
            date[0] = '0'+date[0]
        }
        date = date[2]+"-"+date[1]+"-"+date[0]

        this.setState({
            displayTaskAdder: "block",
            dateForTask: date
        })
    }

    // Выключаем меню добавления заданий
    hideTaskAdder(date){
        this.setState({
            displayTaskAdder: "none",
            dateForTask: date
        })
    }

    render(){
        let weekStyle = {
            margin: 10,
            width: "68%",
            boxSizing: "border-box",
            height: screen.availHeight*0.8 - 60,
            textAlign: "center"
        }
        let leftArrowStyle = {
            position: "flex",
            float: "left",
            width: 20,
            display: "inline-block",
            paddingTop: 0.5*(screen.availHeight*0.8 - 60),
            cursor: "pointer"
        }
        let rightArrowStyle = {
            position: "flex",
            float: "right",
            width: 20,
            display: "inline-block",
            paddingTop: 0.5*(screen.availHeight*0.8 - 60),
            cursor: "pointer"
        }

        // Получаем текущую дату в удобном для чтения виде
        let now = new Date()
        let days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
        let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
        let day = now.getDay() == 0 ? 6 : now.getDay()-1

        // Собираем компоненты дней недели
        let desk = []

        // Если неделя текущая
        if (this.state.week == 0){
            for (let i = 0; i < 7; i++){
                let today = new Date()

                // Если собираем компонент дня, который идёт до сегодняшнего
                if (i < day){
                    today.setHours(-24*(day-i))
                    desk.push(<Day key={i} tasksInPocket={this.state.tasksInPocket} showTaskAdder={this.showTaskAdder} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }

                // Если собираем компонент сегодняшнего дня
                else if(i == day){
                    desk.push(<Day key={i} tasksInPocket={this.state.tasksInPocket} showTaskAdder={this.showTaskAdder} desk_id={this.state.id} currentDay={true} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }

                // Если собираем компонент дня, который идёт после сегодняшнего
                else{
                    today.setHours(24*(i-day))
                    desk.push(<Day key={i} tasksInPocket={this.state.tasksInPocket} showTaskAdder={this.showTaskAdder} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }
            }
        }

        // Если неделя не текущая
        else{
            for (let i = 0; i < 7; i++){
                let today = new Date()
                today.setHours(-24*(day-i) + 24*7*this.state.week)
                desk.push(<Day key={i} tasksInPocket={this.state.tasksInPocket} showTaskAdder={this.showTaskAdder} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
            }
        }
        let pocket
        if (true){ // Если есть доступ
            pocket = <Pocket tasksId={this.state.tasksInPocket} desk_id={this.state.id}/>
        }
        return(
            <div style={weekStyle}>
                <div style={leftArrowStyle} onClick={this.decrementWeek}>◀</div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                {pocket}
                {desk}
                </DragDropContext>
                <div style={rightArrowStyle} onClick={this.incrementWeek}>▶</div>
                <TaskAdder desk_id={this.state.id} needUpdate={this.needUpdate} displayTaskAdder={this.state.displayTaskAdder} dateForTask={this.state.dateForTask} hideTaskAdder={this.hideTaskAdder}/>
            </div>
        )
    }
}

// Меню добавления заданий
class TaskAdder extends React.Component{
    constructor(props){
        super(props)

        this.state = {

            // Установка задания на несколько дней
            isPeriod: false,

            // Установка задания на конкретное время
            isTime: false,

            // Начальная дата задания
            dateForTaskFirst: this.props.dateForTask,

            // Конечная дата задания (по умолчанию такая же, как и начальная)
            // Если задание устанавливается на несколько дней, то это состояние принимает значение конечной даты
            dateForTaskSecond: this.props.dateForTask,

            // Конкретное время задания
            hours: 0,
            minutes: 0
        }

        this.setPeriod = this.setPeriod.bind(this)
        this.unsetPeriod = this.unsetPeriod.bind(this)
        this.setDateForTaskFirst = this.setDateForTaskFirst.bind(this)
        this.setDateForTaskSecond = this.setDateForTaskSecond.bind(this)
        this.addTask = this.addTask.bind(this)
        this.setTime = this.setTime.bind(this)
        this.unsetTime = this.unsetTime.bind(this)
        this.setHours = this.setHours.bind(this)
        this.setMinutes = this.setMinutes.bind(this)
    }

    // Установка периода задания
    setPeriod(){
        this.setState({
            isPeriod: true
        })
    }

    // Удаление периода задания
    unsetPeriod(){
        this.setState({
            isPeriod: false
        })
    }

    // Установка конкретного времени завершения задания
    setTime(){
        this.setState({
            isTime: true
        })
    }

    // Удаление конкретного времени завершения задания
    unsetTime(){
        this.setState({
            isTime: false
        })
    }

    // Установка новой даты для задания в меню создания, если необходимо
    shouldComponentUpdate(newProps){
        if (this.state.dateForTaskFirst != newProps.dateForTask){
            this.setState({
                dateForTaskFirst: newProps.dateForTask,
                dateForTaskSecond: newProps.dateForTask
            })
        }
        return true;
    }

    // Установка начальной даты задания
    setDateForTaskFirst(){
        this.setState({
            dateForTaskFirst: document.querySelector("#taskAdderForm").taskDateFirst.value
        })
    }

    // Установка конечной даты задания
    setDateForTaskSecond(){
        this.setState({
            dateForTaskSecond: document.querySelector("#taskAdderForm").taskDateSecond.value
        })
    }

    // Установка времени (во сколько часов) завершения задания
    setHours(){
        let h = Math.ceil(document.querySelector("#taskAdderForm").timeHours.value)
        if (h >= 0 && h <= 23){
            this.setState({
                hours: h
            })
        }
        else{
            if (h > 23){
                this.setState({
                    hours: 0
                })
            }
            else{
                this.setState({
                    hours: 23
                })
            }
        }
    }

    // Установка времени (во сколько минут) завершения задания
    setMinutes(){
        let m = Math.ceil(document.querySelector("#taskAdderForm").timeMinutes.value)
        if (m >= 0 && m <= 59){
            this.setState({
                minutes: m
            })
        }
        else{
            if (m > 59){
                let h = this.state.hours + 1
                if (h > 23){
                    h = 0
                }
                this.setState({
                    hours: h,
                    minutes: 0
                })
            }
            else{
                this.setState({
                    minutes: 59
                })
            }
        }
    }

    // Добавление задания в базу данных
    addTask(){
        let form = document.querySelector("#taskAdderForm")
        if (form != null){

            // Сбор информации о задании (название, важность, категория, дата и время выполнения)
            let task = form.task.value
            let importance = form.importance.value
            let category = form.category.value
            let timestampFirst = new Date(this.state.dateForTaskFirst)
            timestampFirst = timestampFirst.getTime()
            let timestampSecond = ""
            if (this.state.isPeriod == true){
                timestampSecond = new Date(this.state.dateForTaskSecond)
                timestampSecond = timestampSecond.getTime()
            }
            let time = "null"
            if (this.state.isTime == true){
                time = 
                ((this.state.hours+"").length==1?"0"+this.state.hours:this.state.hours)+":"+
                ((this.state.minutes+"").length==1?"0"+this.state.minutes:this.state.minutes)
            }

            // Проверка корректности указанных данных
            if (task != "" && importance != "" && category != ""){

                // Включаем заглушку
                document.querySelector("#loader").style.display = ""

                // Добавляем задание в базу данных
                let self = this
                $.ajax({
                    url: "desk/addTasks.php",
                    method: "post",
                    data: {
                        
                        // Начальная и конечная даты
                        timestampFirst: timestampFirst,
                        timestampSecond: timestampSecond,

                        // Текст задания, важность и категория
                        task: task,
                        importance: importance,
                        category: category,

                        // Время завершения задания
                        complete_time: time,

                        // ID доски, в которую записывается задание
                        desk_id: this.props.desk_id
                    },
                    success: function() {
                        // Отключаем заглушку
                        document.querySelector("#loader").style.display = "none"

                        // Обновляем компоненты
                        self.props.needUpdate()
                    },
                    async: false
                })
            }
        }
    }

    render(){
        let styleTaskAdder = {
            width: "100vw",
            height: "100vh",
            position: "absolute", 
            top: 0, 
            left: 0,
            textAlign: "center",
            color: "black",
            zIndex: 10,
            display: this.props.displayTaskAdder,
            backgroundColor: "rgba(78, 78, 78, 0.5)"
        }
        let styleFormTaskAdder = {
            width: 350,
            padding: 30,
            position: "relative", 
            top: "50%", 
            left: "50%", 
            margin: "-250px 0 0 -175px",
            backgroundColor: "gray",
            border: "1px solid black",
            borderRadius: 10,
            borderSpacing: 0,
        }
        let styleInputTaskAdder = {
            width: "90%",
            height: 30,
            margin: "5px 0 5px 0",
            borderRadius: 10,
            textAlign: "center"
        }
        let styleCloseButton = {
            width: 20,
            height: 20,
            border: "1px solid black",
            backgroundColor: "rgba(78,78,78)",
            cursor: "pointer",
            position: "absolute",
            right: 10,
            top: 10,
            padding: 1
        }
        let styleNumberButton = {
            width: 40
        }

        // Дата задания (или период)
        let date = []

        // Если период включен
        if (this.state.isPeriod == false){
            date.push(<input key="1" name="dateType" type="radio" checked="checked" onChange={this.unsetPeriod} />)
            date.push(<span key="2">Конкретный день</span>)
            date.push(<input key="3" name="dateType" type="radio" checked="" onChange={this.setPeriod}/>)
            date.push(<span key="4">Период</span>)
            date.push(<br key="5" />)
            date.push(<input key="6" type="date" name="taskDateFirst" value={this.state.dateForTaskFirst} onChange={this.setDateForTaskFirst}/>)
        }

        // Если период выключен
        else {
            date.push(<input key="1" name="dateType" type="radio" checked="" onChange={this.unsetPeriod} />)
            date.push(<span key="2">Конкретный день</span>)
            date.push(<input key="3" name="dateType" type="radio" checked="checked" onChange={this.setPeriod}/>)
            date.push(<span key="4">Период</span>)
            date.push(<br key="5" />)
            date.push(<span key="6">Дата начала:</span>)
            date.push(<input key="7" type="date" name="taskDateFirst" value={this.state.dateForTaskFirst} onChange={this.setDateForTaskFirst}/>)
            date.push(<br key="8" />)
            date.push(<span key="9">Дата окончания:</span>)
            date.push(<input key="10" type="date" name="taskDateSecond" value={this.state.dateForTaskSecond} onChange={this.setDateForTaskSecond}/>)
        }

        // Конкретно время завершения
        let time = []

        // Если конкретное время включено
        if (this.state.isTime == false){
            time.push(<input key="1" name="timeType" type="checkbox" checked="checked" onChange={this.setTime} />)
            time.push(<span key="2">Не указано</span>)
        }

        // Если конкретное время выключено
        else{
            time.push(<input key="1" name="timeType" type="checkbox" checked="" onChange={this.unsetTime} />)
            time.push(<span key="2">Не указано</span>)
            time.push(<br key="3"/>)
            time.push(<input key="4" style={styleNumberButton} name="timeHours" type="number" value={this.state.hours} onChange={this.setHours}/>)
            time.push(<span key="5">:</span>)
            time.push(<input key="6" style={styleNumberButton} name="timeMinutes" type="number" value={this.state.minutes} onChange={this.setMinutes}/>)
        }

        // Важность и категории
        let importance = ["Срочно", "Средней важности", "Не срочно"]
        let category = ["Дом", "Учеба", "Работа"]
        let importancePrint = []
        let categoryPrint = []
        for (let i = 0; i < importance.length; i++){
            importancePrint.push(<option key={i} value={importance[i]}>{importance[i]}</option>)
        }
        for (let i = 0; i < category.length; i++){
            categoryPrint.push(<option key={i} value={category[i]}>{category[i]}</option>)
        }

        return(
        <div style={styleTaskAdder}>
            <form style={styleFormTaskAdder} id="taskAdderForm">
                <div style={styleCloseButton} onClick={this.props.hideTaskAdder}>✖</div>
                <input style={styleInputTaskAdder} type="text" name="task" placeholder="Задача" /><br /><br />
                <span>Дата</span>
                <br />
                {date}
                <br /><br />
                <span>Время выполнения</span><br />
                {time}
                <br /><br />
                <span>Прочие параметры</span><br />
                Категория: <select name="category">{categoryPrint}</select><br />
                Важность: <select name="importance">{importancePrint}</select><br />
                <input type="button" style={styleInputTaskAdder} onClick={this.addTask} value="Добавить задание" />
            </form>
        </div>
        )
    }
}

// День
class Day extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            // Костыль. Необходим для указания приложению о необходимости обновить компонент дня
            update: false
        }

        this.deleteTask = this.deleteTask.bind(this)
        this.completeTask = this.completeTask.bind(this)
        this.uncompleteTask = this.uncompleteTask.bind(this)
    }

    // Удаления задания из базы данных
    deleteTask(id){
        let self = this

        // Включаем заглушку
        document.querySelector("#loader").style.display = "";

        // Выполняем запрос на удаление
        $.ajax({
            url: "desk/deleteTask.php",
            method: "post",
            data: {
                
                // ID задания, которое нужно удалить
                id: id
            },
            success: function() {

                // Выключаем заглушку
                document.querySelector("#loader").style.display = "none";

                // Обновляем компонент
                let update = !self.state.update
                self.setState({
                    update: update
                })
            },
            async: false
        })
    }

    // Установка отметки о выполнении задания
    completeTask(id){
        let self = this

        // Включаем заглушку
        document.querySelector("#loader").style.display = "";

        // Отправляем запрос на установку отметки
        $.ajax({
            url: "desk/completeTask.php",
            method: "post",
            data: {

                // ID задания, которому нужно установить отметку
                id: id
            },
            success: function() {

                // Выключаем заглушку
                document.querySelector("#loader").style.display = "none";

                // Обновляем компонент
                let update = !self.state.update
                self.setState({
                    update: update
                })
            },
            async: false
        })
    }

    // Удаление отметки о выполнении задания
    uncompleteTask(id){
        let self = this

        // Включаем заглушку
        document.querySelector("#loader").style.display = "";

        // Отправляем запрос на удаление отметки
        $.ajax({
            url: "desk/uncompleteTask.php",
            method: "post",
            data: {
                
                // ID задания, которому нужно удалить отметку
                id: id
            },
            success: function() {
                
                // Выключаем заглушку
                document.querySelector("#loader").style.display = "none";
                
                // Обновляем компонент
                let update = !self.state.update
                self.setState({
                    update: update
                })
            },
            async: false
        })
    }

    render(){
        let topStyle = {
            borderBottom: "1px solid black"
        }
        let currentDayTopStyle = {
            borderBottom: "1px solid black",
            color: "red"
        }
        let dayStyle = {
            display: "inline-block",
            width: "13.5%",
            backgroundColor: "white",
            position: "relative",
            border: "1px solid black",
            boxSizing: "border-box",
            marginLeft: 3,
            marginTop: 5,
            verticalAlign: "top",
        }
        let addTaskStyle = {
            backgroundColor: "gray",
            padding: "5px 0px 5px 0px"
        }
        let addButtonStyle = {
            borderRadius: 10,
            border: "none",
            width: "90%",
            height: 32,
            cursor: "pointer"
        }

        // Собираем задания дня
        let tasksPrint = []
        let self = this
        let tasksInPocket = this.props.tasksInPocket
        // Отправляем запрос на список заданий дня
        $.ajax({
            url: "desk/getTasks.php",
            method: "post",
            data: {

                // День
                timestamp: this.props.timestamp,
                
                // ID текущей доски
                desk_id: this.props.desk_id
            },
            success: function( result ) {

                // Обрабатываем полученные задания и создаем их компоненты
                result = JSON.parse(result)
                for (let value in result){
                    if (tasksInPocket == false || tasksInPocket.indexOf(result[value].id) == -1){
                        tasksPrint.push(<Task key={result[value].id} 
                            task={result[value].task}
                            importance={result[value].importance}
                            category={result[value].category}
                            deleteTask={self.deleteTask}
                            completeTask={self.completeTask}
                            uncompleteTask={self.uncompleteTask}
                            isComplete={result[value].isComplete}
                            dayOrder={result[value].dayOrder}
                            completeTime={result[value].completeTime}
                        />)
                    }
                }
            },
            async: false
        })
        
        
        return(
            <div style={dayStyle}>
                <div style={this.props.currentDay?currentDayTopStyle:topStyle}>{this.props.dayOfWeek}<br />{this.props.date}</div>
                <div>
                    <div style={addTaskStyle}>
                        <form id={this.props.dayOfWeek}>
                            <input style={addButtonStyle} type="button" value="Добавить задание" onClick={()=>this.props.showTaskAdder(this.props.date)}/>
                        </form>
                    </div>
                    <Droppable droppableId={""+this.props.timestamp}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef}>
                                {tasksPrint}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>         
            </div>
        )
    }
}

// Задание
class Task extends React.Component{
    render(){
        let styleTask

        // Кнопка завершения
        let completer = <input type="button" onClick={()=>this.props.completeTask(this._reactInternalFiber.key)} value="Завершить"/>
        // Если задание уже завершено, то добавляем кнопку отмены
        if (this.props.isComplete == true){
            styleTask = {
                backgroundColor: "aqua",
                position: "relative",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                marginTop: 20,
                wordBreak: "break-all",
            }
            completer = <input type="button" onClick={()=>this.props.uncompleteTask(this._reactInternalFiber.key)} value="Отменить"/>
        }

        // Если задание не завершено, то даём ему окрас, соответствующий важности
        else{
            if (this.props.importance == "Срочно"){
                styleTask = {
                    backgroundColor: "red",
                    position: "relative",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    marginTop: 20,
                    wordBreak: "break-all",
                }
            }
            else if(this.props.importance == "Средней важности"){
                styleTask = {
                    backgroundColor: "yellow",
                    position: "relative",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    marginTop: 20,
                    wordBreak: "break-all",
                }
            }
            else if(this.props.importance == "Не срочно"){
                styleTask = {
                    backgroundColor: "green",
                    position: "relative",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    marginTop: 20,
                    wordBreak: "break-all",
                }
            }
        }
        let closeButtonStyle = {
            cursor: "pointer",
            position: "absolute",
            right: 0,
            width: 20,
            height: 20,
            display: "inline:block",
            padding: 1,
            border: "1px solid black",
            margin: "5px 5px 0 0",
            backgroundColor: "goldenrod"
        }

        // Время завершения (если указано)
        let time = []
        if (this.props.completeTime != "null"){
            time.push(<br key="1" />)
            time.push(<span key="2">{this.props.completeTime}</span>)
            time.push(<br key="3" />)
        }
        
        return(
            <Draggable draggableId={this._reactInternalFiber.key}
            key={this._reactInternalFiber.key}
            index={this.props.dayOrder - 0}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div style={styleTask}>
                        <div style={closeButtonStyle} onClick={()=>this.props.deleteTask(this._reactInternalFiber.key)}>✖</div>
                        <div>
                            <p>{this.props.category}</p>
                            <span>{this.props.task}</span>
                            <br />
                            {time}
                            <br />
                            {completer}
                        </div>
                    </div>
                </div>
            )}
            </Draggable>
        )
    }
}

class Pocket extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        
        let tasksInPocket = []
        let tasksId = []
        if (this.props.tasksId != false){
            tasksId = this.props.tasksId
        }
        let h = ((tasksId.length == 0 ? 1 : tasksId.length) * 130)
        if (this.props.tasksId != false){
            $.ajax({
                url: "desk/getTasksById.php",
                method: "post",
                data: {

                    tasksId: tasksId,
                    // ID текущей доски
                    desk_id: this.props.desk_id
                },
                success: function( result ) {
                    // Обрабатываем полученные задания и создаем их компоненты
                    result = JSON.parse(result)
                    for (let value in result){
                        tasksInPocket.push(<Task key={result[value].id} 
                            task={result[value].task}
                            importance={result[value].importance}
                            category={result[value].category}
                            deleteTask={self.deleteTask}
                            completeTask={self.completeTask}
                            uncompleteTask={self.uncompleteTask}
                            isComplete={result[value].isComplete}
                            dayOrder={result[value].dayOrder}
                            completeTime={result[value].completeTime}
                        />)
                    }
                },
                async: false
            })
        }
        else{
            tasksInPocket = <div>Кармашек для заданий</div>
        }
        let divStyle = {
            border: "1px solid black",
            height: h,
            width: "13.5%",
            position: "absolute",
            bottom: 10,
            left: 40
        }
        return(
            <div style={divStyle}>
                <Droppable droppableId={"-1"}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                            {tasksInPocket}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }
}