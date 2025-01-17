function PasswordResetForm(){
    {/* Itt kettő részből fog állni:
        1: email cím megadása
        2: megadni a jelszó vissza állító kódot (emailban kapja majd)
     
        */}
    return (
        <>
        <div className="">
        <input type="text" name="email" id="email" />
        <p>Visszaállítási kódot 2 percenként kérhet!</p>
        <input type="button" value="Kód Küldése" />
        </div>
        </>
    )
}
export default PasswordResetForm;