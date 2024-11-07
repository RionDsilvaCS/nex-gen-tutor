import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get path to data.json file
        const dataFilePath = path.join(process.cwd(), 'src', 'data.json');

        // Read existing data
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        // Add new subject
        const newSubject = req.body;
        jsonData.subjects.push(newSubject);

        // Sort subjects by ID to maintain order
        jsonData.subjects.sort((a, b) => a.id - b.id);

        // Write updated data back to file
        await fs.writeFile(
            dataFilePath,
            JSON.stringify(jsonData, null, 2),
            'utf8'
        );

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Subject added successfully',
            subject: newSubject
        });
    } catch (error) {
        console.error('Error updating data.json:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update data.json'
        });
    }
}