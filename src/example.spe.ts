class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.mostrarNombre(name);
    }

    mostrarNombre(name) {
        global.console.log(name);
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);
        if (idx === -1) {
            throw new Error('Friend not found');
        }
        this.friends.splice(idx,1);
    }
}

describe('removeFriend', () => {
    let friend; 
    beforeEach(()=>{
        friend = new FriendsList();
    })

    it('Remove Friend from the list', () => {
      friend.addFriend('Jose');
      expect(friend.friends[0]).toEqual('Jose');
      friend.removeFriend('Jose');
      expect(friend.friends[0]).toBeUndefined();
    });
    
    it('Throw Error when Friend not Fount', () => {
       expect(() => friend.removeFriend('Jose')).toThrow(new Error('Friend not found'));

    })
})


describe('Friend List' ,() => {
    let friend;

    beforeEach(() => {
        friend = new FriendsList();
    });

    it('Inicialization', () => {
        expect(friend.friends.length).toEqual(0);
    });

    it('Agregar uno', () => {
        friend.addFriend('jose');
        expect(friend.friends.length).toEqual(1);
    })
    
    it('mostrar nombre', () => {
        friend.mostrarNombre = jest.fn();
        expect(friend.mostrarNombre).not.toBeCalled();
        friend.addFriend('jose');
        expect(friend.mostrarNombre).toBeCalled();
    })

})