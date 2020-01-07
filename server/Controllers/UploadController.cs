using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using server.Services;
using server.Utilities;
using server.Dtos;
using server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;
using System.IO;
using System.Net.Http.Headers;

namespace server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
         private readonly FileService _fService;    
        public UploadController(FileService fService)
        {
            _fService = fService;
        }
        [AllowAnonymous]
        [HttpPost("file")]
        public  async Task<IActionResult> Upload([FromQuery]string bName)
        {               
             List<ImageFile> list = new List<ImageFile>();      
            try
            {
                var files = Request.Form.Files;
                foreach(var file in files){
                    var folderName = Path.Combine("Resources", "Images");
                    folderName = Path.Combine(folderName,bName);
                    if(!Directory.Exists(folderName))
                        System.IO.Directory.CreateDirectory(folderName);
                    
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
        
                    if (file.Length > 0)
                    {
                        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        var fullPath = Path.Combine(pathToSave, fileName);
                        var dbPath = Path.Combine(folderName, fileName);

                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);                      
                        }
                        ImageFile newFile = new ImageFile();
                        newFile.FileName = file.FileName;
                        newFile.FileOwner = bName;
                        list.Add(newFile);                                                     
                    }
                    else
                    {
                    return BadRequest();
                    }
            }// end of foreach
            if(list.Count > 0)
                await _fService.Create(list);   
        }
        catch (Exception )
        {
            return StatusCode(500, "Internal server error blabla");
        }
        return Ok();
    }

[AllowAnonymous]
[Route("[action]/{bName}")]
[HttpPost("GetBusinessImages")]
public async Task<ActionResult<List<ImageFile>>> GetFiles([FromQuery]string bName)
{
    List<ImageFile> lst = new List<ImageFile>();
    var response = await _fService.GetFiles(bName);
    if (response == null)
                return NotFound("No Images found in the database");   
   return response;
}

[AllowAnonymous]
[Route("[action]/{bName,fileName,fileId}")]
[HttpPost("DeleteImage")]
public async Task<ActionResult<Boolean>> DeleteImage([FromQuery]string bName, [FromQuery]string fileName, [FromQuery]string fileId)
{
    ImageFile file = new ImageFile(fileId,fileName,bName);
    var folderName = Path.Combine("Resources", "Images");
    folderName = Path.Combine(folderName,bName);
    var pathToDelete = Path.Combine(Directory.GetCurrentDirectory(), folderName);
    

    if (System.IO.File.Exists(Path.Combine(pathToDelete, fileName)))    
        {    
        // If file found, delete it    
        System.IO.File.Delete(Path.Combine(pathToDelete, fileName));    
        Console.WriteLine("File deleted from directory.");
         var result = await _fService.DeleteFile(file);
        if (result == false)
            return NotFound("Image was not deleted from the database");
        return Ok(true);  
        }    
    else Console.WriteLine("File not found");
    return NotFound("no such file found in directory");

   
}
        /////////////////////////////////////////////////////////

 
        ////////////////////////////////////////////////////////

}
}