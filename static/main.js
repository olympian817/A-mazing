var game_data,
    user_data,
    board_data,
    sq_display = function() {
        _.template('<td data-id=<%- square_id %>></td>')
    },
    render_board = function(board) {
        var template, squares;

        var f = _.after(2, function() {
            var sorted_squares = [];
            _.each(squares, function(square) {
                sorted_squares[square.x] = sorted_squares[square.x] || [];
                sorted_squares[square.x][square.y] = square;
            });

            $('.body').html(_.template(template)({
                board: board, squares: sorted_squares
            }));

            $('.board td').on('click', function(e) {
                var $el = $(e.currentTarget);
                var offset = $el.offset();
                var height = $el.height();

                var x = e.pageX - offset.left;
                var y = offset.top + height - e.pageY;

                var square_id = $el.data('id');
                var square = _.findWhere(squares, {id: square_id});

                var q = [
                    (y > x && y > -x + height),
                    (y < x && y > -x + height),
                    (y < x && y < -x + height),
                    (y > x && y < -x + height)
                ];

                var neighboring_square = _.find(squares, function(s) {
                    if (q[0]) {
                        return (s.y == square.y && s.x == square.x - 1);
                    } else if (q[1]) {
                        return (s.y == square.y + 1 && s.x == square.x);
                    } else if (q[2]) {
                        return (s.y == square.y && s.x == square.x + 1);
                    } else if (q[3]) {
                        return (s.y == square.y - 1 && s.x == square.x);
                    }
                });

                if (q[0]) {
                    square.up = !square.up;
                    if (neighboring_square) {
                        neighboring_square.down = !neighboring_square.down;
                    }
                } else if (q[1]) {
                    square.right = !square.right;
                    if (neighboring_square) {
                        neighboring_square.left = !neighboring_square.left;
                    }
                } else if (q[2]) {
                    square.down = !square.down;
                    if (neighboring_square) {
                        neighboring_square.up = !neighboring_square.up;
                    }
                } else if (q[3]) {
                    square.left = !square.left;
                    if (neighboring_square) {
                        neighboring_square.right = !neighboring_square.right;
                    }
                }

                var success = _.after((neighboring_square ? 2 : 1), function() { render_board(board); });

                if (neighboring_square) {
                    $.ajax ({
                        url: Amazing.url + '/square/' + neighboring_square.id,
                        method: 'put',
                        contentType: 'application/json',
                        data: JSON.stringify(neighboring_square),
                        success: success
                    });
                }

                $.ajax ({
                    url: Amazing.url + '/square/' + square_id,
                    method: 'put',
                    contentType: 'application/json',
                    data: JSON.stringify(square),
                    success: success
                })
            });
        });

        $.ajax ({
            url: 'board_template.html',
            method: 'get',
            success: function(template_data) {
                template = template_data;
                f();
            }
        });

        $.ajax ({
            url: Amazing.url + '/square/?' + $.param({board_id: board.id}),
            method: 'get',
            contentType: 'application/json',
            success: function(square_data) {
                squares = square_data.data;
                f();
            }
        })
    },
    submit_board = function() {
        var boardname = $('#board_name').val();
        $.ajax ({
            url: Amazing.url + '/board/',
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({width: $('#mazeWidth').val(), height: $('#mazeHeight').val(), name: boardname}),
            success: render_board
        });
    },
    del_board = function(e) {
        var $el = $(e.currentTarget);
        var id = $el.data('id');
        $.ajax ({
            url: Amazing.url + '/board/' + id,
            method:'delete',
            contentType:'application/json'
        })
        location.reload();
    },
    make_user = function() {
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
    },
    del_user = function(e) {
        var $el = $(e.currentTarget);
        var id = $el.data('id');
        $.ajax ({
            url: Amazing.url + '/user/' + id,
            method: 'delete',
            contentType: 'application/json'
        });
        location.reload();
    },
    post_game = function() {
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
    },
    del_game = function() {
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
    },
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
            $('#submit').on('click', make_user)
        });
        $('.body').on('click', '.link2', del_user)
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
            var gameName = '<p>Game Name:</p><br><input id = "game_name"><br><br><select><option>[Select Board]</option></select><br><br><button id = "submit2">Submit</button>';
            $('.body').html(gameName);
            $('#submit2').on('click', post_game)
        });
        $('.body').on('click', '.link4', del_game)
        html += '<br><br><br><br><h3>BOARDS</h3><table>'
        for (e=0;e<board_data.length;e++) {
            html += '<tr>'
            html += '<td>' + board_data[e].name + '</td>' + '<td><a class = "link6" href=#! data-id=' + board_data[e].id + '>Delete board</a></td>';
            html += '<tr>'
        }
        $('.body').on('click', '.link6', del_board)
        html += '<tr id="new-board-row">';
        html += '<td><a id = "link5" href=#!>Add new board</a></td>';
        html += '</tr>';
        html += '</table>';
        $('.body').html(html);
        if (!Amazing.user) {
            $('#new-board-row').hide();
        }
        $('.body').on('click', '#link5', function(e) {
            var boardName = '<p>Board Name</p><br>' +
            '<input id="board_name"><br><br><p>Height</p>' +
            '<input id="mazeHeight"<br><p>Width</p><input id="mazeWidth"><br><button name="submit_board">Submit</button>'
            $('.body').html(boardName);
            $('.body').on('click', '[name=submit_board]', submit_board)
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
    }});