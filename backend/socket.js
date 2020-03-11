module.exports = function(io){

    io.on('connection', function(socket){
        console.log('a user connected');
        
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('join', (params, callback) => {
            socket.join(params);
            callback();
        });

        socket.on('task_addormove', (params, callback) => {
            socket.to(params).emit('update tasks', "fetch tasks again");
        });

        socket.on('project_rename', (params, callback) => {
            socket.to(params._id).emit('update project name', params.name);
        });

        socket.on('member_list_update', (params, callback) => {
            socket.to(params).emit('update members', "member added/deleted. fetch again");
        });

        socket.on('project_delete', (params, callback) => {
            socket.to(params).emit('leave project', "Project deleted by owner.");
        });

        socket.on('inform_member', (params, callback) => {
            socket.to(params).emit('fetch projects', "You have been added/removed to/form a project.");
        });

        socket.on('task_updated', (params, callback) => {
            socket.to(params.tid).emit('fetch updated task', "Some changes have been done on a task.");
            socket.to(params.pid).emit('update tasks', "Some changes have been done on a task.");
        });

        socket.on('task_deleted', (params, callback) => {
            socket.to(params.tid).emit('leave task page', "Task has been deleted");
            socket.to(params.pid).emit('update tasks', "Some changes have been done on a task.");
        });
    });

}