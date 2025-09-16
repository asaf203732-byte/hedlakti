
import React, { useState } from 'react';

export default function App() {
  const [studentName, setStudentName] = useState('');
  const [goodPoint, setGoodPoint] = useState('');
  const [studentList, setStudentList] = useState([
    { name: 'יונתן לוי', phone: '0501234567', sent: false, feedbacks: [] },
    { name: 'נועה כהן', phone: '0527654321', sent: false, feedbacks: [] },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newFeedback, setNewFeedback] = useState('');

  const dailyTemplates = [
    "היום ראיתי את {name} עושה משהו מיוחד: {point}. זה חימם לי את הלב.",
    "פשוט התרגשתי לראות את {name} כשהוא {point}. חשבתי שכדאי שתדעו 💛",
    "יש רגעים קטנים שעושים את היום – {name} עשה משהו כזה היום: {point}.",
    "חשבתי עליכם היום – {name} הפתיע אותי כש{point}. כל הכבוד לו!",
  ];

  const [templateIndex] = useState(Math.floor(Math.random() * dailyTemplates.length));

  const nameToUse = selectedStudent?.name || studentName || '___';
  const filledMessage = dailyTemplates[templateIndex]
    .replace('{name}', nameToUse)
    .replace('{point}', goodPoint || '___');

  const markAsSent = () => {
    if (!selectedStudent) return;
    setStudentList(studentList.map(s =>
      s.name === selectedStudent.name ? { ...s, sent: true } : s
    ));
  };

  const sendWhatsapp = () => {
    const phone = selectedStudent?.phone || '';
    const text = encodeURIComponent(filledMessage);
    markAsSent();
    window.open(`https://wa.me/972${phone.slice(1)}?text=${text}`, '_blank');
  };

  const sendSMS = () => {
    const phone = selectedStudent?.phone || '';
    const text = encodeURIComponent(filledMessage);
    markAsSent();
    window.open(`sms:${phone}?body=${text}`);
  };

  const addNewStudent = () => {
    if (newStudentName && newStudentPhone) {
      setStudentList([...studentList, { name: newStudentName, phone: newStudentPhone, sent: false, feedbacks: [] }]);
      setNewStudentName('');
      setNewStudentPhone('');
    }
  };

  const addFeedback = () => {
    if (!selectedStudent || !newFeedback) return;
    setStudentList(studentList.map(s =>
      s.name === selectedStudent.name
        ? { ...s, feedbacks: [...s.feedbacks, newFeedback] }
        : s
    ));
    setNewFeedback('');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', direction: 'rtl' }}>
      <h1>הדלקתי</h1>
      <p>היום כבר הדלקת את האור של מישהו?</p>

      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
        <label>
          👥 בחר תלמיד:
          <select
            value={selectedStudent?.name || ''}
            onChange={(e) => {
              const student = studentList.find(s => s.name === e.target.value);
              setSelectedStudent(student);
              setStudentName('');
            }}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          >
            <option value=''>בחר...</option>
            {studentList.map((s, i) => (
              <option key={i} value={s.name}>
                {s.name} {s.sent ? '✅' : ''}
              </option>
            ))}
          </select>
        </label>

        <label>
          🧒 או כתוב שם חדש:
          <input
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value);
              setSelectedStudent(null);
            }}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </label>

        <label>
          🌟 מה ראית בו טוב היום?
          <input
            value={goodPoint}
            onChange={(e) => setGoodPoint(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </label>

        <div style={{ background: '#e0f0ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {filledMessage}
        </div>

        <button onClick={() => {navigator.clipboard.writeText(filledMessage); markAsSent();}} style={{ margin: '4px' }}>📋 העתק ושלח</button>
        <button onClick={sendWhatsapp} style={{ margin: '4px' }}>📱 וואטסאפ</button>
        <button onClick={sendSMS} style={{ margin: '4px' }}>💬 SMS</button>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
          <h3>➕ הוספת תלמיד חדש</h3>
          <input placeholder="שם" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <input placeholder="טלפון" value={newStudentPhone} onChange={(e) => setNewStudentPhone(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <button onClick={addNewStudent}>📚 הוסף תלמיד</button>
        </div>

        {selectedStudent && (
          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <h4>💬 פידבקים מההורים</h4>
            <ul>
              {selectedStudent.feedbacks.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <textarea placeholder="פידבק חדש..." value={newFeedback} onChange={(e) => setNewFeedback(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
            <button onClick={addFeedback}>✨ שמור תגובה</button>
          </div>
        )}
      </div>
    </div>
  );
}
