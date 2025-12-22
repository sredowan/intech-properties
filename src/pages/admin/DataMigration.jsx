import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
// import data from '../../data.json'; // Removed as file is deleted
import { Database, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DataMigration() {
    const [status, setStatus] = useState('idle'); // idle, process, success, error
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const migrateData = async () => {
        setStatus('error');
        setLogs([]);
        addLog('Error: Source data.json file has been removed.');
        addLog('Migration is no longer possible from this tool.');
        /*
        setStatus('process');
        setLogs([]);
        addLog('Starting migration...');

        try {
            const batch = writeBatch(db);
            let count = 0;

            // Migration logic commented out as data is undefined
            // ...

            addLog('Migration Complete!');
            setStatus('success');

        } catch (error) {
            console.error(error);
            addLog(`Error: ${error.message}`);
            setStatus('error');
        }
        */
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#001253] mb-8 flex items-center gap-3">
                <Database /> Data Migration
            </h1>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-start gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                        <Upload size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Import from local data.json</h2>
                        <p className="text-gray-500 mb-4">
                            This tool is currently disabled as the source `data.json` file has been removed after successful migration.
                        </p>

                        {status === 'idle' && (
                            <button
                                onClick={migrateData}
                                className="bg-gray-400 text-white px-6 py-3 rounded-lg font-bold cursor-not-allowed flex items-center gap-2"
                            >
                                Start Migration
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm max-h-64 overflow-y-auto">
                    {logs.length === 0 ? (
                        <span className="text-gray-500">System Ready.</span>
                    ) : (
                        logs.map((log, i) => <div key={i}>{log}</div>)
                    )}
                </div>
            </div>
        </div>
    );
}
