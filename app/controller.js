/**
 * Created by saber on 4/6/14.
 */
'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', function ($scope, $sb, myConfig) {
        var db, view;

        (function () {
            db = $sb.couch.db;
            view = 'findByComputer';
            $scope.search = null;
            $scope.flash = $sb.util.flash.get();

            init();
            fetchComputerList(view);
        })();

        //INIT
        function init() {
            $scope.computers = [];
            $scope.item = {};
            $scope.descending = $scope.descending || false;
            $scope.currentPage = 1;
            $scope.totalPage = 1;
        }

        $scope.prev = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }
            fetchComputerList(view);
        }

        $scope.next = function () {
            if ($scope.currentPage < $scope.totalPage) {
                $scope.currentPage++;
            }
            fetchComputerList(view);
        }

        $scope.reverse = function (name) {
            init();
            $scope.descending = !$scope.descending;
            switch (name) {
                case 'computer':
                    fetchComputerList('findByComputer');
                    break;
                case 'introduced':
                    fetchComputerList('findByIntroduced');
                    break;
                case 'discontinued':
                    fetchComputerList('findByDiscontinued');
                    break;
                case 'company':
                    fetchComputerList('findByCompany');
                    break;
            }
        }

        $scope.filter = function () {
            init();
            fetchComputerList(view);
        }

        function fetchComputerList(name) {
            if ($scope.search) {
                var opt = {
                    include_docs: true,
                    descending: false,
                    limit: myConfig.PAGE_SIZE,
                    skip: myConfig.PAGE_SIZE * ($scope.currentPage - 1),
                    startkey: $scope.search,
                    endkey: $scope.search + '\ufff0'
                };
                name = 'findByComputer';
            } else {
                var opt = {
                    include_docs: true,
                    descending: $scope.descending,
                    limit: myConfig.PAGE_SIZE,
                    skip: myConfig.PAGE_SIZE * ($scope.currentPage - 1)
                };
            }
            $sb.couch.view(view = name, opt, renderComputerList());
        }

        function renderComputerList() {
            return function (res) {
                pagination(res.total_rows);
                $scope.computers = [];
                res.rows.forEach(function (row, i) {
                    $scope.computers[i] = row.doc;
                });
            }
        }

        function renderCompanyListName() {
            return function (res) {
                res.rows.forEach(function (company) {
                    fetchAll(company.doc._id);
                })
            }
        }

        function fetchAll(company_id) {
            var opts = {
                include_docs: true,
                reduce: false,
                limit: myConfig.PAGE_SIZE,
                skip: myConfig.PAGE_SIZE * ($scope.currentPage - 1),
                startkey: [company_id],
                endkey: [company_id, 2]
            };
            $sb.couch.view('findByCompanyId', opts, renderAll());
        }

        function renderAll() {
            return function (res) {
                if (res.rows.length > 1) {
                    var company = res.rows.pop();
                    pagination(res.total_rows);
                    res.rows.forEach(function (row, i) {
                        $scope.computers[i] = row.doc;
                        $scope.computers[i].company = company.doc.name;
                    })
                } else {
                    $sb.util.log('Not found computer with company.')
                }

            }
        }

        function fetchList(name, cb) {
            var opts = {
                include_docs: true,
                reduce: false,
                descending: $scope.descending,
                limit: myConfig.PAGE_SIZE,
                skip: myConfig.PAGE_SIZE * ($scope.currentPage - 1)
            };
            $sb.couch.view(name || 'findByComputerName', opts, cb || renderCompanyList());
        }

        function renderCompanyList() {
            return function (res) {
                pagination(res.rows.length);
                $scope.computers = [];
                res.rows.forEach(function (row, i) {
                    fetchOneCompany(row.doc.company_id, i);
                    $scope.computers[i] = row.doc;
                });
            }
        }

        function fetchOneCompany(id, i) {
            var opts = {
                include_docs: true,
                key: [id, 1]
            };
            $sb.couch.view('findByCompanyId', opts, renderOneCompany(id, i));
        }

        function renderOneCompany(id, i) {
            return function (res) {
                if (res.rows.length === 0) {
                    $sb.util.log("Not found company by id " + id);
                } else {
                    var name = res.rows[0].doc.name;
                    $scope.computers[i].company = name;
                }
            }
        }


        function pagination(totalItem) {
            $scope.totalPage = Math.ceil(totalItem / myConfig.PAGE_SIZE);
            if ($scope.currentPage > $scope.totalPage) {
                $scope.item = {}
            } else if ($scope.currentPage < $scope.totalPage) {
                $scope.item = {
                    total: totalItem,
                    start: ($scope.currentPage - 1) * myConfig.PAGE_SIZE + 1,
                    end: $scope.currentPage * myConfig.PAGE_SIZE
                }
            } else {
                $scope.item = {
                    total: totalItem,
                    start: ($scope.currentPage - 1) * myConfig.PAGE_SIZE + 1,
                    end: totalItem
                }
            }
        }
    }
)
    .
    controller('MyCtrl2', function ($scope, $sb, $location) {
        var db;

        (function () {
            db = $sb.couch.db;
            $scope.company = {};
            $scope.computer = db.newDoc();
            fetchListCompany();
        })();

        $scope.addNewComputer = function () {
            $scope.computer.company_id = $scope.company.id;
            $scope.computer.type = 'computer';
            $scope.computer.save().success(function () {
                $sb.util.flash.put('success', 'Done! The Computer has been created.');
                $location.path('/');
            }).error($sb.util.log);
        }

        function fetchListCompany() {
            $sb.couch.view('findByCompanyId', {}, renderListCompany());
        }

        function renderListCompany() {
            return function (res) {
                $scope.companies = res.rows;
            }
        }
    })
    .controller('MyCtrl3', function ($scope, $routeParams, $sb, $location) {
        var db;

        (function () {
            db = $sb.couch.db;
            $scope.computer = db.newDoc();
            $scope.computer.load($routeParams.id).success(function () {
                $scope.company = {id: $scope.computer.company_id};
            });
            fetchListCompany();
        })();

        $scope.updateComputer = function () {
            $scope.computer.company_id = $scope.company.id;
            $scope.computer.type = 'computer';
            $scope.computer.save().success(function () {
                $sb.util.flash.put('success', 'Done! The Computer has been updated.');
                $location.path('/');
            }).error($sb.util.log);
        }

        $scope.delete = function (computer) {
            computer.remove().success(function () {
                $sb.util.flash.put('success', 'Done! The Computer has been deleted.');
                $location.path('/');
            }).error($sb.util.log);
        }

        function fetchListCompany() {
            $sb.couch.view('findByCompanyId', {}, renderListCompany());
        }

        function renderListCompany() {
            return function (res) {
                $scope.companies = res.rows;
            }
        }
    })