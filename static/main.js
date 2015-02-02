var game_data,
    user_data,
    board_data,
    render = _.after(3, function() {
        var html = '<h3>USERS</h3><table>';
        for (var e=0;e<user_data.length;e++) {
            html += '<tr>';
            html += '<td>' + '<a href=#! class = "signIn" data-id="' + user_data[e].id + '">' + user_data[e].name + '</a></td>' + '<td><a class = "link2" href=#! data-id=' + user_data[e].id + '>Delete user</a></td>';
            html += '</tr>';
        }
        $('.body').on('click', '.signIn', function(e) {
            Amazing.user = _.findWhere(user_data, {id: $(e.target).data('id')});
            $('#new-game-row').show();
            $('#new-board-row').show();
        })
        html += '<tr>';
        html += '<td><a id = "link" href=#!>Add new user</a></td>';
        html += '</tr>';
        html += '</table>';
        $('.body').html(html);
        $('.body').on('click', '#link', function() {
            var username = '<p>Username:</p><input id = "username_input"><br><br><button id = "submit">Submit</button>';
            $('.body').html(username);
            $('#submit').on('click', function() {
                var username_val = $('#username_input').val();
                $.ajax ({
                    url: Amazing.url + '/user/',
                    method: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({name: username_val}),
                    success: function(r) {
                        console.log(r);
                    } 
                });
                location.reload();
            });
        });
        $('.body').on('click', '.link2', function(e) {
            var $el = $(e.currentTarget);
            var id = $el.data('id');
            $.ajax ({
                url: Amazing.url + '/user/' + id,
                method: 'delete',
                contentType: 'application/json'
            });
            location.reload();
        });
        html += '<br><br><br><br><h3>GAMES</h3><table>';
        for (var e=0;e<game_data.length;e++) {
            html += '<tr>';
            html += '<td><a href = #! class = "joinGame">' + game_data[e].name + '</a></td>' + '<td><a class = "link4" href=#! data-game_id=' + game_data[e].id + '>Delete game</a></td>';
            html += '</tr>';
        }

        html += '<tr id="new-game-row">';
        html += '<td><a id = "link3" href=#!>Add new game</a></td>';
        html += '</tr>';
        html += '</table>';
        $('.body').html(html);

        if (!Amazing.user) {
            $('#new-game-row').hide();
        }

        $('.body').on('click', '#link3', function(e) {
            var gameName = '<p>Game Name:</p><br><input id = "game_name"><br><br><br><button id = "submit2">Submit</button>';
            $('.body').html(gameName);
            $('#submit2').on('click', function() {
                var gamename_val = $('#game_name').val();
                $.ajax ({
                    url: Amazing.url + '/game/',
                    method: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({name: gamename_val, owner_id: Amazing.user.id}),
                    success: function(r) {
                        console.log(r);
                    }
                });
                location.reload();
            });
        });
        $('.body').on('click', '.link4', function(e) {
            var $el = $(e.currentTarget),
                id = $el.data('game_id');
            $.ajax ({
                url: Amazing.url + '/game/' + id,
                method: 'delete',
                contentType: 'application/json',
                success: function() {
                    $el.parents('tr').remove();
                }
            });
        });

        html += '<br><br><br><br><h3>BOARDS</h3><table>'
        for (e=0;e<board_data.length;e++) {
            html += '<tr>'
            html += '<td>' + board_data[e].name + '</td>' + '<td><a class = "link6" href=#! data-id=' + board_data[e].id + '>Delete user</a></td>';
            html += '<tr>'
        }
        html += '<tr id="new-board-row">';
        html += '<td><a id = "link5" href=#!>Add new board</a></td>';
        html += '</tr>';
        html += '</table>';
        $('.body').html(html);

        if (!Amazing.user) {
            $('#new-board-row').hide();
        }

        $('.body').on('click', '#link5', function(e) {
            var boardName = '<p>Board Name</p><br><br><input id="board_name"><br><br><button id="submit_board">Submit</button>'
            $('.body').html(boardName);
            $('.body').on('click', '#submit_board', function(e) {
                boardname = $('#board_name').val();
                $.ajax ({
                    url: Amazing.url + '/board/',
                    method: 'post',
                    contentType: 'application/json'
                    data: JSON.stringify({id: board.id, width: board.width, height: board.height}),
                    success: function(r) {
                        console.log(r);
                    }
                });
            });
        });
    });

$.ajax ({
    url: Amazing.url + '/game/',
    success: function(r) {
        game_data = r.game_data;
        render();
    }});

$.ajax ({
    url: Amazing.url + '/user/',
    success: function(r) {
        user_data = r.data;
        render();
    }});

$.ajax ({
    url:Amazing.url + '/board/',
    success: function(r) {
        board_data = r.data;
        render();
    }})
