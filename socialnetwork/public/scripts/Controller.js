var app=angular.module("app",[]);
app.controller("Ctrl", function ($scope,$window, Myservice) {
    $scope.register = function(){
        if($scope.user.password!=$scope.repassword){
            alert("password in correct");
        }else{
            Myservice.register($scope.user).then(function(data){
                var p = data.data;  
                alert(p.message);
            });
        }
    }

    $scope.authentificate=function(){
        Myservice.authentificate($scope.lg).then(function(data){
            console.log(data.data.user);
            localStorage.setItem('userID',data.data.user.id);
            localStorage.setItem('actif',data.data.user.actif);
            localStorage.setItem('userName',data.data.user.name);
            $window.location.href="/profile.html";
        });
    }
});
app.controller('profile',function($scope,$window,Myservice){
    //##############"intialisation###############
    $scope.name = localStorage.getItem("userName");
    var id = localStorage.getItem("userID");

    Myservice.getFriend(id).then(function(data){
        $scope.friendlist = data.data;
        $scope.frinedNumber = $scope.friendlist.length;
    });
    Myservice.getPub(id).then(function(data){
        $scope.publist = data.data;
        $scope.pubNumber = $scope.publist.length;
    });
    Myservice.possibleFriends(id).then(function(data){
            $scope.PossibleFriend = data.data;
        });
    Myservice.getfriendshiprequest(id).then(function(data){
        if(data){
            $scope.notif=true;
            $scope.friendrequest=data.data;
            $scope.nbrNotif = $scope.friendrequest.length;
        }
    });
    $scope.ftest=[];
    $scope.frinedspubtest=[];
    Myservice.test(id).then(function(data){
        angular.forEach(data.data,function(value,index) {
            $scope.ftest.push({id:value._id, content:value.content, creator:value.user});
        });
        angular.forEach($scope.ftest,function(value,index){
            Myservice.getuser(value.creator).then(function(data){
                $scope.frinedspubtest.push({content:value.content,creator:data.data.name});
            });
        });
    });

    $scope.logout = function(){
        $scope.mdl={};
        $scope.mdl.id=id;
         Myservice.logout($scope.mdl).then(function(){
         });
           localStorage.clear();
           $window.location.href = '/index.html';
    }
    //#####################Publication Manage######
    //delete a publication
    $scope.deletPub = function(id){
        Myservice.deletePub(id);
        $window.location.reload();
    }
    //add a publication
     $scope.pub={};
    $scope.addpub = function(){
        $scope.pub.user=id;
        $scope.pub.content=$scope.content;
        Myservice.addpub($scope.pub).then(function(data){
            console.log(data.data);
            $window.location.reload();
        });
    }
    //update a publication
    $scope.updateModel={};
    $scope.edit=function(id){
        $scope.updateModel.id=id;
        Myservice.getpublucation(id).then(function(data){
             $scope.statue =data.data.content;          
        });
       
    }  
    $scope.update=function(){
        $scope.updateModel.content=$scope.statue;
        Myservice.updatePub($scope.updateModel).then(function(data){
            $window.location.reload();
        });
    }
    //#####################friendship Manage######
//send a friendship request
    $scope.send={};
    $scope.send.creator=id;     
    $scope.sendRequest =function(id) {
        $scope.send.resever =id; 
        Myservice.sendfriendshiprequest($scope.send).then(function(data){
        });
        $window.location.reload();
    }
//accept a friendship request
    $scope.accept=function(id){
        $scope.send.resever=id;
        Myservice.acceptfriend($scope.send).then(function(data){
        });
        $window.location.reload();
    }
//refuse a friendship request
    $scope.refuse=function(id){
        $scope.send.resever=id;
        Myservice.deletefriendshiprequest($scope.send).then(function(data){
        });
        $window.location.reload();
    }
    //test
    $scope.test=function(){
        
    }
});
app.service('Myservice',function($http){
   
    this.register =function(data){
        var response = $http({
            method:"POST",
            url:"/users/register",
            data: JSON.stringify(data),
            datatype:"json"
        });
        return response;
    }
    this.authentificate = function(data){
        var response = $http({
            method:"POST",
            url:"/users/authentification",
            data: JSON.stringify(data),
            datatype:"json"
        });
        return response;
    }
    this.getFriend = function(id){
        return $http.get('/users/friend/'+id)
    }

    //get it by user id
    this.getPub = function(id){
       return $http.get('/publications/pub/'+id);
    }
    this.addpub = function(data){
        var response = $http({
            method:"POST",
            url:"/publications/publication",
            data:JSON.stringify(data),
            datatype:"json"
        });
        return response;
    }
    this.deletePub = function(id){
        $http.delete('/publications/publication/'+id);
    }
    this.updatePub = function(data){
        var response = $http({
            method:"PUT",
            url:"/publications//publication",
            data:JSON.stringify(data),
            datatype:"json"
        });
        return response;
    }
    this.getpublucation = function(id){
        return $http.get('/publications/publication/'+id);
    }
    this.test = function(id){
        return $http.get('/publications/publVisible/'+id);
    }
    this.sendfriendshiprequest=function(data){
         var response = $http({
            method:"POST",
            url:"/users/sendFriendrequest",
            data:JSON.stringify(data),
            datatype:"json"
        });
        return response;
    }
    this.getfriendshiprequest = function(id){
        return $http.get('/users/freindshirequest/'+id);
    }
    this.acceptfriend = function(data){
         var response = $http({
            method:"PUT",
            url:"/users/update",
            data:JSON.stringify(data),
            datatype:"json"
        });
        return response;
    }
    this.deletefriendshiprequest=function(data){
       var response = $http({
           method:"post",
           url:"/users/refuse",
           data:JSON.stringify(data),
           datatype:"json"
       });
       return response;
    }
    this.possibleFriends=function(id){
        return $http.get('/users/pfriendtest/'+id);
    }
    this.getuser=function(id){
        return $http.get('/users/user/'+id);
    }

    this.logout=function(data){
       var response = $http({
            method:"PUT",
            url:"/users/logout",
            data:JSON.stringify(data),
            datatype:"json"
        });
        return response;
    }
});