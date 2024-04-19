import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    summary: { 
        flex: 1, 
        justifyContent: 'top', 
        alignItems: 'center', 
        marginTop:0,
        paddingVertical:15, 
        backgroundColor: '#8b8b8b',
    },
    reportBg: { 
        backgroundColor: '#8b8b8b',
    },
    name: {
        fontSize: 32,
        textDecorationLine: 'underline',
        color: '#500000',
    },
    table: {
        marginTop:30,
        flex:1,
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#687472',
        paddingVertical: 10,
    },
    rowEnd: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0,
        borderBottomColor: '#687472',
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },
    modifybutton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 4,
        padding: 3,
        marginTop: 10,
        paddingHorizontal: 20,
        paddingLeft:10,
        backgroundColor: '#AFAFAF',
    },
    modifybuttonText: {
        fontSize: 24,
        //color: '#500000',
        
    },
    entryContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#AFAFAF',
    },
    reportRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 0,
        marginHorizontal: 0,
    },
    reportCell: {
        flex: 1,
        marginRight: 0,
        paddingRight: 0,
    },

    reportValue: {
        marginTop: 2,
        fontWeight: '800',
        color: '#500000',
    },
    reportValueTime: {
        marginTop: 2,
        fontWeight: '400',
        color: '#500000',
    },

    nutritionalInfoContainer: {
        marginTop: 15,
        //paddingRight: 40,
        //paddingLeft: 40,
        marginHorizontal: 0,
    },
    reportHeader: {
        //fontWeight: '800',
        textDecorationLine: 'underline',
        textAlign: 'center',
        //color: '#500000',
    },
    reportDetails: {
        textAlign: 'center',
        borderWidth: 1,
        left: 0,
        //borderColor: '#500000',
        //color: '#500000',
    },
    reportDetailsRight: {
        textAlign: 'center',
        borderWidth: 1,
        paddingHorizontal: 0,
    },
    column: {
        width: 150,
    },
    tableRow: {
        flexDirection: 'row',
        paddingHorizontal: '9.5%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
      },
      

    leftAlign: {
        textAlign: 'left',
        paddingLeft: 15,
    },
    rightAlign: {
        textAlign: 'right',
        paddingRight: 15,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '90%',
        alignSelf: 'center'
      },
      saveButton: {
        backgroundColor: 'blue',
        padding: 10,
        margin: 10,
        borderRadius: 5
      },
      saveButtonText: {
        color: 'white',
        textAlign: 'center'
      },

});
